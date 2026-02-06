use serde_json::json;
use tauri::Manager;
use tauri_plugin_http::reqwest::{
    header::{ACCEPT, AUTHORIZATION, CONTENT_TYPE},
    Client,
};

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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            let _ = app
                .get_webview_window("main")
                .expect("no main window")
                .set_focus();
        }))
        .invoke_handler(tauri::generate_handler![report_issue])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
