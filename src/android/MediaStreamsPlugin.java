package com.adobe.phonegap.media;

import android.Manifest;
import android.content.pm.PackageManager;
import android.util.Log;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PermissionHelper;
import org.json.JSONException;

public class MediaStreamsPlugin extends CordovaPlugin {

    private static final String LOG_TAG = "MediaStreams";

    public static final int PERMISSION_DENIED_ERROR = 20;
    public static final int GET_PERMISSIONS = 0;

    @Override
    protected void pluginInitialize() {
        super.pluginInitialize();

        boolean needRecordAudioPermission =
                !PermissionHelper.hasPermission(this, Manifest.permission.RECORD_AUDIO);

        boolean needModifyAudioPermission =
                !PermissionHelper.hasPermission(this, Manifest.permission.MODIFY_AUDIO_SETTINGS);

        boolean needCameraPermission =
                !PermissionHelper.hasPermission(this, Manifest.permission.CAMERA);

        Log.d(LOG_TAG, "record " + needRecordAudioPermission + " modify " + needModifyAudioPermission + " camera " + needCameraPermission);

        if (needRecordAudioPermission || needModifyAudioPermission || needCameraPermission) {
            if (needRecordAudioPermission && needModifyAudioPermission && needCameraPermission) {
                PermissionHelper.requestPermissions(this, GET_PERMISSIONS, new String[]{Manifest.permission.RECORD_AUDIO, Manifest.permission.MODIFY_AUDIO_SETTINGS, Manifest.permission.CAMERA});
            } else if (needRecordAudioPermission && needModifyAudioPermission) {
                PermissionHelper.requestPermissions(this, GET_PERMISSIONS, new String[]{Manifest.permission.RECORD_AUDIO, Manifest.permission.MODIFY_AUDIO_SETTINGS});
            } else if (needRecordAudioPermission && needCameraPermission) {
                PermissionHelper.requestPermissions(this, GET_PERMISSIONS, new String[]{Manifest.permission.RECORD_AUDIO, Manifest.permission.CAMERA});
            } else if (needModifyAudioPermission && needCameraPermission) {
                PermissionHelper.requestPermissions(this, GET_PERMISSIONS, new String[]{Manifest.permission.MODIFY_AUDIO_SETTINGS, Manifest.permission.CAMERA});
            } else if (needRecordAudioPermission) {
                PermissionHelper.requestPermission(this, GET_PERMISSIONS, Manifest.permission.RECORD_AUDIO);
            } else if (needModifyAudioPermission) {
                PermissionHelper.requestPermission(this, GET_PERMISSIONS, Manifest.permission.MODIFY_AUDIO_SETTINGS);
            } else if (needCameraPermission) {
                PermissionHelper.requestPermission(this, GET_PERMISSIONS, Manifest.permission.CAMERA);
            }
        }
    }

    public void onRequestPermissionResult(int requestCode, String[] permissions,
                                          int[] grantResults) throws JSONException {
        for (int r : grantResults) {
            if (r == PackageManager.PERMISSION_DENIED) {
                Log.d(LOG_TAG, "we had a permission denied");
                return;
            }
        }
        Log.d(LOG_TAG, "all permissions are good");
    }
}
