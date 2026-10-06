use serde::Serialize;
use serde_json::json;
use tauri::{Manager, Runtime, Url, Webview};
use tauri_plugin_http::reqwest::{
    header::{ACCEPT, AUTHORIZATION, CONTENT_TYPE},
    Client,
};
use tauri_plugin_updater::UpdaterExt;

const REPORT_TOKEN: Option<&'static str> = option_env!("REPORT_TOKEN");

async fn send_github_issue(title: String, message: String) -> Result<String, String> {
    let token = REPORT_TOKEN.ok_or("REPORT_TOKEN is not set")?;
    let url = "https://api.github.com/repos/CBx0-dev/AniStream/issues";

    let json_body = json!({
        "title": title,
        "body": message,
        "labels": ["bug", "needs triage"]
    });

    let client = Client::new();

    let response = client
        .post(url)
        .header(CONTENT_TYPE, "application/json")
        .header(ACCEPT, "application/vnd.github+json")
        .header(AUTHORIZATION, format!("Bearer {}", token))
        .body(json_body.to_string())
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let status = response.status();
    let body = response.text().await.map_err(|e| e.to_string())?;

    if !status.is_success() {
        return Err(format!("GitHub API error ({}): {}", status, body));
    }

    Ok(body)
}

#[tauri::command]
async fn report_issue(title: String, message: String) -> Result<String, String> {
    send_github_issue(title, message).await
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct UpdateMetadata {
    rid: u32,
    available: bool,
    current_version: String,
    version: String,
    date: Option<String>,
    body: Option<String>,
    raw_json: serde_json::Value,
}

/// Checks for updates against a runtime-provided server URL.
/// The endpoint is `<domain>/api/information/client`.
#[tauri::command]
async fn check_update<R: Runtime>(
    webview: Webview<R>,
    server_url: String,
) -> Result<Option<UpdateMetadata>, String> {
    let endpoint = format!(
        "{}/api/information/client",
        server_url.trim_end_matches('/')
    );
    let url = Url::parse(&endpoint).map_err(|e| e.to_string())?;

    let updater = webview
        .updater_builder()
        .endpoints(vec![url])
        .map_err(|e| e.to_string())?
        .build()
        .map_err(|e| e.to_string())?;

    let Some(update) = updater.check().await.map_err(|e| e.to_string())? else {
        return Ok(None);
    };

    let current_version = update.current_version.clone();
    let version = update.version.clone();
    let body = update.body.clone();
    let raw_json = update.raw_json.clone();
    let date = update
        .date
        .and_then(|d| d.format(&time::format_description::well_known::Rfc3339).ok());

    // Register the Update in the resource table so the plugin's
    // download/install commands can resolve it via its rid.
    let rid = webview.resources_table().add(update);

    Ok(Some(UpdateMetadata {
        rid,
        available: true,
        current_version,
        version,
        date,
        body,
        raw_json,
    }))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_opener::init());

    #[cfg(not(debug_assertions))]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            let _ = app
                .get_webview_window("main")
                .expect("no main window")
                .set_focus();
        }));
    }
    #[cfg(debug_assertions)]
    {
        builder = builder.setup(|app| {
            let _ = app
                .get_webview_window("main")
                .expect("no main window")
                .open_devtools();
            Ok(())
        });
    }

    builder
        .invoke_handler(tauri::generate_handler![report_issue, check_update])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}