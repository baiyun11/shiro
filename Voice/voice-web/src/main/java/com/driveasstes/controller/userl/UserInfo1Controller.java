package com.driveasstes.controller.userl;

import com.driveasstes.data.model.po.Userl;
import com.driveasstes.data.model.po.UserInfol;
import com.driveasstes.service.UserInfo1Service;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

/**
 * @ClassName UserInfoController
 * @Description
 * @Author lin.tianwen
 * @Date 2019/9/11 14:08
 */
@Api(tags = "用户信息")
@RequestMapping("userInfo")
@RestController
public class UserInfo1Controller {

    @Autowired
    UserInfo1Service userInfo1Service;


    @ApiOperation(value = "保存", notes = "")
    @ApiImplicitParam(name = "{\"user\": {\n" +
            "      \"account\": \"110\",\n" +
            "      \"password\": \"123456\"\n" +
            "    },\n" +
            "    \"userName\": \"78\",\n" +
            "    \"sex\": \"公猪\",\n" +
            "    \"signature\": \"58\",\n" +
            "    \"avator\": \"股骨头\",\n" +
            "    \"age\": 18,\n" +
            "    \"location\": \"地狱\",\n" +
            "    \"videoSum\": 5,\n" +
            "    \"follers\": 223,\n" +
            "    \"fans\": 324\n" +
            "  }", value = "请求示例")
    @PostMapping("save")
    public void save(@RequestBody UserInfol userInfol) {
        userInfo1Service.save(userInfol);
    }


    @ApiOperation(value = "查询", notes = "只需传入token")
    @PostMapping("find")
    public UserInfol find(HttpServletRequest request) {

        String token = request.getHeader("token");
        String phone = "JWTUtil.getUsername(token)";

        Userl userl = new Userl();
        userl.setAccount(phone);

        UserInfol userInfol = new UserInfol();
        userInfol.setUserl(userl);

        return userInfo1Service.findByUser(userInfol);
    }

}
