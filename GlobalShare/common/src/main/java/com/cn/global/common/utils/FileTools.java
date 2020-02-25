package com.cn.global.common.utils;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

/**
 * @ClassName FileTools
 * @Description 文件工具类
 * @Author lin.tianwen
 * @Date 2018/9/19 16:01
 */
public class FileTools {
    /**
     * @return void
     * @Author lin.tianwen
     * @Description 文件上传，重名时不会进行覆盖动作
     * @Date 2018/9/18 11:38
     * @Param [file, filePath, fileName]
     **/
    public static void uploadFile(byte[] file, String filePath, String fileName) throws Exception {
        File targetFile = new File(filePath);
        //如果文件存在，直接抛出异常，不存在才进行上传，不会进行覆盖动作
        if (!new File(filePath + fileName).exists()) {
            if (!targetFile.exists()) {
                targetFile.mkdirs();
            }
            //使用缓冲流
            FileOutputStream fileOutputStream = null;
            BufferedOutputStream bufferedOutputStream = null;
            try {
                fileOutputStream = new FileOutputStream(filePath + fileName);
                bufferedOutputStream = new BufferedOutputStream(fileOutputStream);
                bufferedOutputStream.write(file, 0, file.length);
            } catch (Exception e) {
                throw new Exception("文件写入失败！");
            } finally {
                bufferedOutputStream.flush();
                fileOutputStream.close();
                bufferedOutputStream.close();
            }
        } else {
            throw new Exception("文件已存在！");
        }
    }

    /**
     * @return java.lang.String
     * @Author lin.tianwen
     * @Description 赋予文件新名称
     * @Date 2018/9/19 9:04
     * @Param [fileName]
     **/
    public static String rename(String fileName) {
        //文件类型名
        String string = fileName.substring(fileName.lastIndexOf("."));
        //UUID
        String uuid = UUID.randomUUID().toString().replace("-", "");

        String dateStr = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());

        return dateStr + uuid + string;
    }

    /**
     * @return void
     * @Author lin.tianwen
     * @Description 文件上传，重名时会覆盖原文件
     * @Date 2018/9/18 11:38
     * @Param [file, filePath, fileName]
     **/
    public static void saveFile(byte[] file, String filePath, String fileName) throws Exception {
        File targetFile = new File(filePath);

        if (!targetFile.exists()) {
            targetFile.mkdirs();
        }
        //使用缓冲流
        FileOutputStream fileOutputStream = null;
        BufferedOutputStream bufferedOutputStream = null;
        try {
            fileOutputStream = new FileOutputStream(filePath + fileName);
            bufferedOutputStream = new BufferedOutputStream(fileOutputStream);
            bufferedOutputStream.write(file, 0, file.length);
        } catch (Exception e) {
            throw new Exception("文件写入失败！");
        } finally {
            bufferedOutputStream.flush();
            fileOutputStream.close();
            bufferedOutputStream.close();
        }
    }
}
