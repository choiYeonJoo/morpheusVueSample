package mcore.edu.sample;

import m.client.android.library.core.bridge.InterfaceJavascript;
import m.client.android.library.core.managers.CallBackWebView;
import m.client.android.library.core.utils.CommonLibUtil;
import m.client.android.library.core.utils.PLog;
import m.client.android.library.core.view.MainActivity;

import android.app.DownloadManager;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Parcelable;
import android.provider.MediaStore;
import android.provider.Settings;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.URLUtil;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.core.content.FileProvider;

import mcore.edu.sample.implementation.DateToString;
import mcore.edu.sample.implementation.ExtendWNInterface;
import mcore.edu.sample.samples.utils.BitmapUtils;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Date;

/**
 * BaseActivity Class
 * 
 * @author 김태욱(<a mailto="tukim@uracle.co.kr">tukim@uracle.co.kr</a>)
 * @version v 1.0.0
 * @since Android 2.1 <br>
 *        <DT><B>Date: </B>
 *        <DD>2013.08.01</DD>
 *        <DT><B>Company: </B>
 *        <DD>Uracle Co., Ltd.</DD>
 * 
 * 모피어스 내에서 제공되는 모든 Web 페이지의 기본이 되는 Activity
 * html 화면은 모두 BaseActivity 상에서 출력된다.
 * 제어를 원하는 이벤트들은 overriding 하여 구현하며, 각각 페이지 별 이벤트는 화면 단위로 분기하여 처리한다.
 * 플랫폼 내부에서 사용하는 클래스로 해당 클래스의 이름은 변경할 수 없다.
 * 
 * Copyright (c) 2001-2011 Uracle Co., Ltd. 
 * 166 Samseong-dong, Gangnam-gu, Seoul, 135-090, Korea All Rights Reserved.
 */

public class BaseActivity extends MainActivity {

	public ValueCallback<Uri[]> filePathCallbackLollipop;
	public final static int FILECHOOSER_LOLLIPOP_REQ_CODE = 2002;
	public final static int NATIVE_TAKE_PICTURE = 2003;
	private Uri cameraImageUri = null;
	public static int MAX_IMG_SIZE = 500;
	private static int tempFileIndex = 0;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		getWebView().setWebChromeClient(new CustomWebChromeClient(this, getWebView().getWNInterfaceManager().getInterfaceJS()));
//		getWebView().setDownloadListener(new MyWebViewClient());
	}
	/**
	 * Webview가 시작 될 때 호출되는 함수
	 */
	@Override
	public void onPageStarted (WebView view, String url, Bitmap favicon) {
		super.onPageStarted(view, url, favicon);

		//시스템 폰트 사이즈 무시
		if (Build.VERSION.SDK_INT > Build.VERSION_CODES.ICE_CREAM_SANDWICH) {
			view.getSettings().setTextZoom(100);
		}
	}
	
	/**
	 * Webview내 컨텐츠가 로드되고 난 후 호출되는 함수
	 */
	@Override
	public void onPageFinished(WebView view, String url)  {
		super.onPageFinished(view, url);
	}

	//확장 class
	public class CustomWebChromeClient extends CallBackWebView {

		public CustomWebChromeClient(MainActivity _callerObject, InterfaceJavascript IFjscript) {
			super(_callerObject, IFjscript);
		}

		//For Android 5.0+
		public boolean onShowFileChooser(
				WebView webView, ValueCallback<Uri[]> filePathCallback,
				FileChooserParams fileChooserParams) {

			// Callback 초기화
			if (filePathCallbackLollipop != null) {
				filePathCallbackLollipop.onReceiveValue(null);
				filePathCallbackLollipop = null;
			}
			filePathCallbackLollipop = filePathCallback;

			boolean isCapture = fileChooserParams.isCaptureEnabled();

			runCamera(isCapture);
			return true;
		}
	}

	// 카메라 기능 구현
	private void runCamera(boolean _isCapture) {
		Intent intentCamera = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);

		//File path = String.format()Environment.getExternalStorageDirectory();
		String mRootPath = getDataDir().getAbsolutePath() +"/" + ".NF";
		String filePath = String.format("%s/%s",mRootPath,"temp.png");
		File file = new File(mRootPath); // temp.png 는 카메라로 찍었을 때 저장될 파일명이므로 사용자 마음대로
		if(!file.exists())file.mkdir();
		try {
			File tempFile = File.createTempFile("temp", ".png", file);

			if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
				cameraImageUri = FileProvider.getUriForFile(BaseActivity.this, "mcore.edu.sample.provider", tempFile);
			} else {
				cameraImageUri = Uri.fromFile(tempFile);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}

		intentCamera.putExtra(MediaStore.EXTRA_OUTPUT, cameraImageUri);

		if (_isCapture) {
			// capture가 camera로 설정되는 경우 바로 카메라 실행
			startActivityForResult(intentCamera, FILECHOOSER_LOLLIPOP_REQ_CODE);

			return;
		}
		Intent pickIntent = new Intent(Intent.ACTION_PICK);

		pickIntent.setType(MediaStore.Images.Media.CONTENT_TYPE);
		pickIntent.setData(MediaStore.Images.Media.EXTERNAL_CONTENT_URI);

		String pickTitle = "사진 가져올 방법을 선택하세요.";
		Intent chooserIntent = Intent.createChooser(pickIntent, pickTitle);

		// 카메라 intent 포함시키기..
		chooserIntent.putExtra(Intent.EXTRA_INITIAL_INTENTS, new Parcelable[]{intentCamera});
		startActivityForResult(chooserIntent, FILECHOOSER_LOLLIPOP_REQ_CODE);

	}

	public static Bitmap resizeBitmapImageFn(Bitmap bmpSource, int maxResolution) {
		int iWidth = bmpSource.getWidth();
		int iHeight = bmpSource.getHeight();
		int newWidth = iWidth;
		int newHeight = iHeight;
		float rate = 0.0F;
		if (maxResolution < MAX_IMG_SIZE) {
			return bmpSource;
		} else {
			if (iWidth > iHeight) {
				if (maxResolution < iWidth) {
					rate = (float) maxResolution / (float) iWidth;
					newHeight = (int) ((float) iHeight * rate);
					newWidth = maxResolution;
				}
			} else if (maxResolution < iHeight) {
				rate = (float) maxResolution / (float) iHeight;
				newWidth = (int) ((float) iWidth * rate);
				newHeight = maxResolution;
			}
			Bitmap newBitmap = Bitmap.createScaledBitmap(bmpSource, newWidth, newHeight, true);
			bmpSource.recycle();
			return newBitmap;
		}
	}

	@Override
	public void onActivityResult(int requestCode, int resultCode, Intent data) {
		super.onActivityResult(requestCode, resultCode, data);

		if (requestCode == FILECHOOSER_LOLLIPOP_REQ_CODE) {
			if (resultCode == RESULT_OK) {
				if (filePathCallbackLollipop == null) return;
				if (data == null)
					data = new Intent();
				if (data.getData() == null)
					data.setData(cameraImageUri);

				String resizePath = null;
				Bitmap bitmap = null;
				try {
					int ori = BitmapUtils.getOrientationOfImage(this, data.getData());
					bitmap = MediaStore.Images.Media.getBitmap(getContentResolver(), data.getData());
					bitmap = BitmapUtils.getRotatedBitmap(bitmap, ori);
					bitmap = resizeBitmapImageFn(bitmap, 640);
					File storage = getFilesDir(); //  path = /data/user/0/YOUR_PACKAGE_NAME/files
					String fileDir = storage.getAbsolutePath() + "/resize";
					int quality = 100;
					// resizePath = BitmapUtils.saveResizeImage(fileDir, bitmap, quality, "temp.jpg");

					String fileName = "temp_" + DateToString.dateString(new Date(), "yyyyMMddHHmmss") + "_" + tempFileIndex + ".jpg";
					tempFileIndex++;

					double fileSize;
					do {
						resizePath = BitmapUtils.saveResizeImage(fileDir, bitmap, quality, fileName);
						fileSize = BitmapUtils.getFileSize(resizePath, "MB");
						quality = quality - 10;
					} while (fileSize>=1 && quality>0);
				} catch (IOException e) {
					e.printStackTrace();
				} catch (Exception e) {
					e.printStackTrace();
				} finally {
					if (bitmap != null)
						bitmap.recycle();
				}

				if (resizePath != null) {
					Uri u = Uri.fromFile(new File(resizePath));

					Intent i = new Intent();
					i.setData(u);

					filePathCallbackLollipop.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, i));
					filePathCallbackLollipop = null;
				} else {
					if (data.getData() != null) {
						filePathCallbackLollipop.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, data));
						filePathCallbackLollipop = null;
					} else {
						filePathCallbackLollipop.onReceiveValue(null);
						filePathCallbackLollipop = null;
					}
				}

			} else {
				if (filePathCallbackLollipop != null) {   //  resultCode에 RESULT_OK가 들어오지 않으면 null 처리하지 한다.(이렇게 하지 않으면 다음부터 input 태그를 클릭해도 반응하지 않음)
					filePathCallbackLollipop.onReceiveValue(null);
					filePathCallbackLollipop = null;
				}
			}
		}
	}
}
