package com.adobe.phonegap.media;

import android.Manifest;
import android.content.pm.PackageManager;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PermissionHelper;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

public class MediaStreamsPlugin extends CordovaPlugin {

  private static final String LOG_TAG = "MediaStreams";

  public static final int PERMISSION_DENIED_ERROR = 20;
  public static final int GET_PERMISSIONS = 0;

  public CallbackContext callbackContext;

  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    Log.d(LOG_TAG, "execute");
    if (action.equals("getUserMedia")) {
      this.callbackContext = callbackContext;

      boolean audio = args.getBoolean(0);
      boolean video = args.getBoolean(1);

      boolean needRecordAudioPermission = !PermissionHelper.hasPermission(this, Manifest.permission.RECORD_AUDIO)
          && audio;

      boolean needModifyAudioPermission = !PermissionHelper.hasPermission(this,
          Manifest.permission.MODIFY_AUDIO_SETTINGS) && audio;

      boolean needCameraPermission = !PermissionHelper.hasPermission(this, Manifest.permission.CAMERA) && video;

      Log.d(LOG_TAG, "record " + needRecordAudioPermission + " modify " + needModifyAudioPermission + " camera "
          + needCameraPermission);

      if (needRecordAudioPermission || needModifyAudioPermission || needCameraPermission) {
        if (needRecordAudioPermission && needModifyAudioPermission && needCameraPermission) {
          PermissionHelper.requestPermissions(this, GET_PERMISSIONS, new String[] { Manifest.permission.RECORD_AUDIO,
              Manifest.permission.MODIFY_AUDIO_SETTINGS, Manifest.permission.CAMERA });
        } else if (needRecordAudioPermission && needModifyAudioPermission) {
          PermissionHelper.requestPermissions(this, GET_PERMISSIONS,
              new String[] { Manifest.permission.RECORD_AUDIO, Manifest.permission.MODIFY_AUDIO_SETTINGS });
        } else if (needRecordAudioPermission && needCameraPermission) {
          PermissionHelper.requestPermissions(this, GET_PERMISSIONS,
              new String[] { Manifest.permission.RECORD_AUDIO, Manifest.permission.CAMERA });
        } else if (needModifyAudioPermission && needCameraPermission) {
          PermissionHelper.requestPermissions(this, GET_PERMISSIONS,
              new String[] { Manifest.permission.MODIFY_AUDIO_SETTINGS, Manifest.permission.CAMERA });
        } else if (needRecordAudioPermission) {
          PermissionHelper.requestPermission(this, GET_PERMISSIONS, Manifest.permission.RECORD_AUDIO);
        } else if (needModifyAudioPermission) {
          PermissionHelper.requestPermission(this, GET_PERMISSIONS, Manifest.permission.MODIFY_AUDIO_SETTINGS);
        } else if (needCameraPermission) {
          PermissionHelper.requestPermission(this, GET_PERMISSIONS, Manifest.permission.CAMERA);
        }

        PluginResult r = new PluginResult(PluginResult.Status.NO_RESULT);
        r.setKeepCallback(true);
        callbackContext.sendPluginResult(r);
      } else {
        this.callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
      }

      return true;
    }
    return false;
  }

  public void onRequestPermissionResult(int requestCode, String[] permissions, int[] grantResults)
      throws JSONException {
    for (int r : grantResults) {
      if (r == PackageManager.PERMISSION_DENIED) {
        Log.d(LOG_TAG, "we had a permission denied");
        this.callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, PERMISSION_DENIED_ERROR));
        return;
      }
    }
    Log.d(LOG_TAG, "all permissions are good");
    this.callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
  }
}
