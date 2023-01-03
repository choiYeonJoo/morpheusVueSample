package mcore.edu.sample.samples.utils;

import android.content.Context;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.media.ExifInterface;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.FileProvider;

import mcore.edu.sample.implementation.ExtendWNInterface;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Calendar;


public class BitmapUtils {
    private static final int MAX_QUALITY = 100;
    private static final int MIN_QUALITY = 70;

    @Nullable
    public static Bitmap StringToBitmap(String encodedString) {
        try {
            byte[] encodeByte = Base64.decode(encodedString, Base64.DEFAULT);
            return BitmapFactory.decodeByteArray(encodeByte, 0, encodeByte.length);
        } catch (Exception e) {
            return null;
        }
    }

    public static void makeFile(Bitmap bitmap, String path, String filename) {
        File file = new File(path);
        if (!file.exists()) {
            file.mkdirs();
        }

        String fullPath = String.format("%s%s", path, filename);
        File fileCacheItem = new File(fullPath);
        OutputStream out = null;
        try {
            fileCacheItem.createNewFile();
            out = new FileOutputStream(fileCacheItem);
            bitmap.compress(Bitmap.CompressFormat.PNG, MAX_QUALITY, out);
        } catch (Exception e) {
        } finally {
            try {
                assert out != null;
                out.close();
            } catch (IOException e) {
            }
        }
    }

    public static String makeMMSFile(Bitmap bitmap, String path, String filename) {
        File file = new File(path);
        if (!file.exists()) {
            file.mkdirs();
        }

        String fullPath = String.format("%s/%s", path, filename);
        File fileCacheItem = new File(fullPath);
        OutputStream out = null;
        try {
            fileCacheItem.createNewFile();
            out = new FileOutputStream(fileCacheItem);
            bitmap.compress(Bitmap.CompressFormat.JPEG, 40, out);
        } catch (Exception e) {
        } finally {
            try {
                assert out != null;
                out.close();
            } catch (IOException e) {
            }
        }

        return fileCacheItem.getAbsoluteFile().getAbsolutePath();
    }

    public static Bitmap makeResizedBitmapForMMS(Context context, Bitmap photo) {
        Bitmap resized = photo;
        int height = photo.getHeight();
        int width = photo.getWidth();

        while (height > 480) {
            resized = Bitmap.createScaledBitmap(photo, (width * 480) / height, 480, true);
            height = resized.getHeight();
            width = resized.getWidth();
        }

        // 예전 파일 삭제
        String mRootPath = Environment.getExternalStorageDirectory().getAbsolutePath() +
                "/" + "EM";
        File rootFile = new File(mRootPath);
        if (Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState())) {
            if (rootFile.exists() && rootFile.isDirectory()) {
                File[] files = rootFile.listFiles();
                for (int i = 0; i < files.length; i++) {
                    File file = files[i];
                    try {
                        file.delete();
                    } catch (Exception e) {

                    }
                }
            }
        }

        return resized;
    }

    public static String makeBitmapForMMS(Context context, Bitmap photo) {
        String mRootPath = Environment.getExternalStorageDirectory().getAbsolutePath() +
                "/" + "APP";
        File rootFile = new File(mRootPath);
        if (Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState())) {
            if (!rootFile.exists()) {
                rootFile.mkdir();
            }
        }
        Calendar calendar = Calendar.getInstance();
        String fileName = String.format("APP%02d%02d%02d-%02d%02d%02d.jpg",
                calendar.get(Calendar.YEAR) % 100, calendar.get(Calendar.MONTH) + 1,
                calendar.get(Calendar.DAY_OF_MONTH), calendar.get(Calendar.HOUR_OF_DAY),
                calendar.get(Calendar.MINUTE), calendar.get(Calendar.SECOND));

        String path = mRootPath + "/" + fileName;

        Bitmap resized = null;
        int height = photo.getHeight();
        int width = photo.getWidth();

        while (height > 480) {
            resized = Bitmap.createScaledBitmap(photo, (width * 480) / height, 480, true);
            height = resized.getHeight();
            width = resized.getWidth();
        }

        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        resized.compress(Bitmap.CompressFormat.JPEG, 60, bytes);

        //rotateBitmap.compress(Bitmap.CompressFormat.JPEG, 100, bytes);

        File f = new File(path);
        try {
            f.createNewFile();
            FileOutputStream fo = null;
            fo = new FileOutputStream(f);
            fo.write(bytes.toByteArray());
            fo.close();
        } catch (Exception e) {
        }

        Uri cameraImageUri;
        if (Build.VERSION.SDK_INT > Build.VERSION_CODES.Q) {
            cameraImageUri = Uri.fromFile(f);
        } else {
            cameraImageUri = FileProvider.getUriForFile(context, "mcore.edu.sample.provider", f);
        }

        return path;
    }

    public static boolean clearFile(String path) {
        File oldFile = new File(path);
        if (oldFile.exists()) {
            return oldFile.delete();
        }
        return false;
    }

    public static String getPathFromUri(Context context,Uri uri){
        Cursor cursor = context.getContentResolver().query(uri, null, null, null, null );
        cursor.moveToNext();
        String path = cursor.getString( cursor.getColumnIndex( "_data" ) );
        cursor.close();
        return path;
    }
    public static String BitmapToString(@NonNull Bitmap bitmap) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, MIN_QUALITY, baos);
        byte[] bytes = baos.toByteArray();
        return Base64.encodeToString(bytes, Base64.DEFAULT);
    }

    @NonNull
    public static byte[] BitmapToByteArray(@NonNull Bitmap bitmap) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.JPEG, MIN_QUALITY, baos);
        return baos.toByteArray();
    }

    // 이미지 리사이즈 후 저장
    public static String saveResizeImage(String savePath, Bitmap bitmap, int quality, String name) {
        String fileDir = savePath;
        File dir = new File(fileDir);
        if(!dir.exists()) {
            dir.mkdir();
        }

        String fileName = name;
        File imgFile = new File(fileDir, fileName);
        try {
            imgFile.createNewFile();
            FileOutputStream out = new FileOutputStream(imgFile);
            bitmap.compress(Bitmap.CompressFormat.JPEG, quality, out); //썸네일로 사용하므로 퀄리티를 낮게설정
            out.close();
        } catch (FileNotFoundException e) {
            Log.e("saveBitmapToJpg","FileNotFoundException : " + e.getMessage());
            return null;
        } catch (IOException e) {
            Log.e("saveBitmapToJpg","IOException : " + e.getMessage());
            return null;
        }
        return fileDir + "/" + fileName;
    }

    // 파일 용량 구하기
    public static double getFileSize(String path, String unit){
        File file = new File(path);
        if (file.exists()) {
            double bytes = file.length();
            Log.d("KDS", "bytes = " + bytes);
            double kilobytes = (bytes / 1024);
            double megabytes = (kilobytes / 1024);
            double gigabytes = (megabytes / 1024);

            double result;
            switch (unit) {
                case "B":
                    result = bytes;
                    break;
                case "KB":
                    result = kilobytes;
                    break;
                case "MB":
                    result = megabytes;
                    break;
                case "GB":
                    result = gigabytes;
                    break;
                default:
                    result = megabytes;
                    break;
            }
            return result;
        } else {
            System.out.println("File does not exists!");
            return 0;
        }
    }

    public static int getOrientationOfImage(Context context, Uri uri) {
        ExifInterface exif = null;
        try {
            exif = new ExifInterface(getRealPathFromURI(context, uri));
        } catch (IOException e) {
            e.printStackTrace();
            try {
                InputStream fi = context.getContentResolver().openInputStream(uri);
                exif = new ExifInterface(fi);
            } catch (IOException e2) {
                e2.printStackTrace();
                return -1;
            }
        }

        int orientation = exif.getAttributeInt(ExifInterface.TAG_ORIENTATION, -1);
        if (orientation != -1) {
            switch (orientation) {
                case ExifInterface.ORIENTATION_ROTATE_90:
                    return 90;
                case ExifInterface.ORIENTATION_ROTATE_180:
                    return 180;
                case ExifInterface.ORIENTATION_ROTATE_270:
                    return 270;
            }
        }

        return 0;
    }

    public static String getRealPathFromURI(Context context, Uri uri) {
        String path = "";
        if (context.getContentResolver() != null) {
            Cursor cursor = context.getContentResolver().query(uri, null, null, null, null);
            if (cursor != null) {
                cursor.moveToFirst();
                int idx = cursor.getColumnIndex(MediaStore.Images.ImageColumns.DATA);
                path = cursor.getString(idx);
                cursor.close();
            }
        }
        return path;
    }

    public static Bitmap getRotatedBitmap(Bitmap bitmap, int degrees) throws Exception {
        if(bitmap == null) return null;
        if (degrees == 0) return bitmap;

        Matrix m = new Matrix();
        m.setRotate(degrees, (float) bitmap.getWidth() / 2, (float) bitmap.getHeight() / 2);

        Bitmap newBitmap = Bitmap.createBitmap(bitmap, 0, 0, bitmap.getWidth(), bitmap.getHeight(), m, true);
        bitmap.recycle();
        return newBitmap;
    }
}
