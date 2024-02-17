// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


use std::time::{SystemTime, UNIX_EPOCH};
use active_win_pos_rs::get_active_window;

#[tauri::command]
fn on_button_clicked() {
  println!("I was invoked from JS!");
  match get_active_window() {
    Ok(active_window) => {
        println!("active window: {:#?}", active_window);
    },
    Err(()) => {
        println!("error occurred while getting the active window");
    }
  }
  get_active_window();
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![on_button_clicked])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
