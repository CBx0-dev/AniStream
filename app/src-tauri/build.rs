use std::env;

fn main() {
    if let Ok(token) = env::var("REPORT_TOKEN") {
        println!("cargo:rustc-env=REPORT_TOKEN={}", token);
    }
    tauri_build::build()
}
