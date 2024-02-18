// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


use std::time::{SystemTime, UNIX_EPOCH};
use active_win_pos_rs::get_active_window;

struct ActiveWindow {
  title: String,
  app_name: String,
  // Other fields...
}

#[tauri::command]
fn on_button_clicked() -> Result<(String, String), &'static str> {
  match get_active_window() {
      Ok(active_window) => {
          // println!("active window: {:#?}", active_window);
          let title = active_window.title.clone();
          let app_name = active_window.app_name.clone();
          return Ok((title, app_name));
      },
      Err(()) => {
          println!("error occurred while getting the active window");
          return Ok(("BROKEN".to_string(), "BROKEN".to_string()));
      }
  }
}


fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![on_button_clicked])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
