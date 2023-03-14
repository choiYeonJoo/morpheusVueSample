package mcore.edu.sample.implementation;

import android.content.pm.PackageManager;
import m.client.android.library.core.view.MainActivity;
import m.client.android.library.core.managers.ActivityHistoryManager;

import android.Manifest;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import m.client.android.library.core.bridge.InterfaceJavascript;
import m.client.android.library.core.utils.PLog;
import m.client.android.library.core.view.AbstractActivity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Build;
import android.view.KeyEvent;
import android.webkit.WebView;

import android.provider.Settings;
import android.net.Uri;

/**
 * ExtendWNInterface Class
 * 
 * @author 류경민(<a mailto="kmryu@uracle.co.kr">kmryu@uracle.co.kr</a>)
 * @version v 1.0.0
 * @since Android 2.1 <br>
 *        <DT><B>Date: </B>
 *        <DD>2011.04</DD>
 *        <DT><B>Company: </B>
 *        <DD>Uracle Co., Ltd.</DD>
 * 
 * 사용자 정의 확장 인터페이스 구현
 * 
 * Copyright (c) 2011-2013 Uracle Co., Ltd. 
 * 166 Samseong-dong, Gangnam-gu, Seoul, 135-090, Korea All Rights Reserved.
 */
public class ExtendWNInterface extends InterfaceJavascript {

	/**
	 * 아래 생성자 메서드는 반드시 포함되어야 한다. 
	 * @param callerObject
	 * @param webView
	 */
	public ExtendWNInterface(AbstractActivity callerObject, WebView webView) {
		super(callerObject, webView);
	}
	
	/**
	 * 보안 키보드 데이터 콜백 함수 
	 * @param data 
	 */
	public void wnCBSecurityKeyboard(Intent data) {  
		// callerObject.startActivityForResult(newIntent,libactivities.ACTY_SECU_KEYBOARD);
	}
	
	////////////////////////////////////////////////////////////////////////////////
	// 사용자 정의 네이티브 확장 메서드 구현
	
	//
	// 아래에 네이티브 확장 메서드들을 구현한다.
	// 사용 예
	//
	public String exWNTestReturnString(String receivedString) {
		String newStr = "I received [" + receivedString + "]";
		return newStr;
	}
	
	/**
	 * WebViewClient의 shouldOverrideUrlLoading()을 확장한다.
	 * @param view
	 * @param url
	 * @return 
	 * 		InterfaceJavascript.URL_LOADING_RETURN_STATUS_NONE	확장 구현을하지 않고 처리를 모피어스로 넘긴다.
	 * 		InterfaceJavascript.URL_LOADING_RETURN_STATUS_TRUE	if the host application wants to leave the current WebView and handle the url itself
	 * 		InterfaceJavascript.URL_LOADING_RETURN_STATUS_FALSE	otherwise return false.
	 */
	public int extendShouldOverrideUrlLoading(WebView view, String url) {

		// Custom url schema 사용 예
//		if(url.startsWith("custom:")) {
//		    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
//		    callerObject.startActivity( intent ); 
//    		return InterfaceJavascript.URL_LOADING_RETURN_STATUS_FALSE;
//    	}
		
		return InterfaceJavascript.URL_LOADING_RETURN_STATUS_NONE;
	}
	
	/**
	 * 페이지 로딩이 시작되었을때 호출된다.
	 * @param view
	 * @param url
	 * @param favicon
	 */
	public void onExtendPageStarted (WebView view, String url, Bitmap favicon) {
		PLog.i("", ">>> 여기는 ExtendWNInterface onPageStarted입니다!!!");
	}
	
	/**
	 * 페이지 로딩이 완료되었을때 호출된다.
	 * @param view
	 * @param url
	 */
	public void onExtendPageFinished(WebView view, String url) {
		PLog.i("", ">>> 여기는 ExtendWNInterface onPageFinished!!!");
	}
	
	/**
	 * Give the host application a chance to handle the key event synchronously
	 * @param view
	 * @param event
	 * @return True if the host application wants to handle the key event itself, otherwise return false
	 */
	public boolean extendShouldOverrideKeyEvent(WebView view, KeyEvent event) {
		
		return false;
	}
	
	/**
	 * onActivityResult 발생시 호출.
	 */
	public void onExtendActivityResult(Integer requestCode, Integer resultCode, Intent data) {
		PLog.i("", ">>> 여기는 ExtendWNInterface onExtendActivityResult!!!  requestCode => [ " + requestCode + " ], resultCode => [ " + resultCode + " ]");
	}
	
	/*
	public String syncTest(String param1, String param2) {
		return param1 + param2;
	}
	
	public void asyncTest(final String callback) {
		callerObject.runOnUiThread(new Runnable() {
			@Override
			public void run() {
				String format = "javascript:%s('abc', 1, {'a':'b'});";
				String jsString = String.format(format, callback);
				PLog.d("asyncTest", jsString);
    			webView.loadUrl(jsString);
			}
		});
	}
	*/
	
	/* 앱 설정 화면으로 이동 */
	public void showSettings(String value, String callback) {
		new Thread(() -> {
			PLog.d("VUE SAMPLE", "CALL showSettings");
			Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
			Uri uri = Uri.fromParts("package", callerObject.getPackageName(), null);
			intent.setData(uri);
			callerObject.startActivity(intent);

			try {
				Thread.sleep(500);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			System.exit(0);
		}).start();
	}

	public void exWNCheckPermission(){
		if (ContextCompat.checkSelfPermission(callerObject, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED
		|| ContextCompat.checkSelfPermission(callerObject, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED
		|| ContextCompat.checkSelfPermission(callerObject, Manifest.permission.MODIFY_AUDIO_SETTINGS) != PackageManager.PERMISSION_GRANTED
		) {

			// 이 권한에 필요한 이유를 설명
			if (ActivityCompat.shouldShowRequestPermissionRationale(callerObject, Manifest.permission.CAMERA)
			|| ActivityCompat.shouldShowRequestPermissionRationale(callerObject, Manifest.permission.RECORD_AUDIO)
			|| ActivityCompat.shouldShowRequestPermissionRationale(callerObject, Manifest.permission.MODIFY_AUDIO_SETTINGS)
			) {
				// 다이어로그같은것을 띄워서 사용자에게 해당 권한이 필요한 이유에 대해 설명합니다
				// 해당 설명이 끝난뒤 requestPermissions()함수를 호출하여 권한허가를 요청해야 합니다

				// Toast.makeText(this, "해당 권한은 외부 저장소에 있는 바이러스 탐지를 위한 것입니다.", Toast.LENGTH_SHORT).show();
				ActivityCompat.requestPermissions(callerObject, new String[] {Manifest.permission.CAMERA, Manifest.permission.RECORD_AUDIO, Manifest.permission.MODIFY_AUDIO_SETTINGS}, 5);
			} else {
				ActivityCompat.requestPermissions(callerObject, new String[] {Manifest.permission.CAMERA, Manifest.permission.RECORD_AUDIO, Manifest.permission.MODIFY_AUDIO_SETTINGS}, 5);
				// 필요한 권한과 요청 코드를 넣어서 권한허가요청에 대한 결과를 받아야 합니다
			}
		}else{
			final MainActivity activity = (MainActivity) ActivityHistoryManager.getInstance().getTopActivity();
			callerObject.runOnUiThread(new Runnable() {
				@Override
				public void run() {
					try {
						activity.getWebView().loadUrl(
								"javascript:onRequestPermissionsResult();");
					}
					catch(NullPointerException e) {
						PLog.d("ERROR", "error["+e.getMessage());
					} catch (Exception e) {
						PLog.d("ERROR", "error["+e.getMessage());
					}
				}
			});
		}
	}
}
