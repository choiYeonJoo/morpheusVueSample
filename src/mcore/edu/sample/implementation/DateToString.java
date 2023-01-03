package mcore.edu.sample.implementation;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * SaveMemo class
 * @author 강희
 *
 * 메모를 저장한다.
 */
public class DateToString {

    public static SimpleDateFormat formatter = new SimpleDateFormat();

    public static synchronized String dateString(Date date, String formatString) {
        formatter.applyPattern(formatString);
        return formatter.format(date);
    }

    public static String formatDateString(Date date) {
        return dateString(date, "yyyy-MM-dd HH:mm");
    }
}
