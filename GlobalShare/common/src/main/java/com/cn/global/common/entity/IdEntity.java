package com.cn.global.common.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import java.io.Serializable;

@Data
@MappedSuperclass
@NoArgsConstructor
@AllArgsConstructor
public abstract class IdEntity implements Serializable {

    private static final long		serialVersionUID	= -2736414933996725173L;

    @Id
    @GeneratedValue
    private Integer id;//主键


}
