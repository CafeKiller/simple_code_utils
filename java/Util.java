public class Util {
    // 定义一个静态方法，用于反转字符串
    public static String reverseStr(String str) {
        // 将字符串转换为字符数组
        char[] charArray = str.toCharArray();
        // 定义左右指针
        int left = 0;
        int right = charArray.length - 1;
        // 当左指针小于右指针时，交换左右指针指向的字符
        while (left < right) {
            char temp = charArray[left];
            charArray[left] = charArray[right];
            charArray[right] = temp;
            left++;
            right--;
        }
        // 将字符数组转换为字符串并返回
        return new String(charArray);
    }
}