用于程序素材积累
# 分界仪表盘动态显示数据
![分界仪表盘动态显示数据.png](https://i.loli.net/2021/04/11/1zvWUNDgm8TxBKi.png)
1. 使用Angular框架与echart
2. options绑定图表
3. merge动态更新图表
4. initOpts控制宽高


# 延迟显示
1. 使用Angular框架
2. 要注意else之后的ID，要写成不一样的


# 模态窗传参
1. Angular父组件向子组件传参
```HTML
<div class="modal-content">
  <div class="modal-header">
    <h4> {{mode}}</h4>
    <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>

  <div class="modal-body">
  </div>
</div>
```
1. 父组件
```typescript
openModal(mode: string){
    const modalRef =this.modalService.open(DiagnosisModalComponent);
    modalRef.componentInstance.mode = mode
  }
```
2. 子组件
```typescript
@Input() mode: string;
```

# 模态窗tab切换
1. 使用Angular与Bootstcrap 
2. 模态窗中无法使用路由显示指定页面，根据路由达到的效果自己编写适用于模态窗的tab切换
3. 利用class叠加的性质，把与切换无关的class先写
4. `class={{定义的变量名}}`和`[class]=this.定义的变量名`都是可以实现绑定的
5. 利用类key为string的性质实现判断
6. 使用了两次绑定，所以不能自动刷新数据，需要手动写刷新

# JS动态标签页增删改
1. 面向对象编程
2. 原生JS实现标签页增删改
# JS网页轮播图
1. 鼠标移动显示隐藏左右按钮
2. 动态生成小圆圈
3. 小圆圈切换图片
4. 点击左右按钮切换一张图片
5. 鼠标控制自动播放