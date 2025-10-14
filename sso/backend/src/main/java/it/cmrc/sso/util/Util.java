package it.cmrc.sso.util;

public class Util {


    public static int getPagesCount(long count, double size) {
        return (int) Math.ceil(count == 0 ? 0 : count / size);
    }

}
