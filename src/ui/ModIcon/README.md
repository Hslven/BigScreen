## mod-icon组件

### 用法
~~~html
<mod-icon name="..." size="" />
~~~

### 支持的图标
mod-icon supports out of the box: **Material Icons** , **Material Symbols** , **Font Awesome**, **Ionicons**, **MDI**, **Eva Icons**, **Themify Icons**, **Line Awesome and Bootstrap Icons**.

支持的图标库 | name参数前缀 |  例子 
-|-|-|
Material Icons | 不需要前缀 |  ```<mod-icon name="thumb_up" size="sm" />```
material-icons-outlined | o_ |  ```<mod-icon name="o_thumb_up" size="sm" />```
material-icons-round | r_ |  ```<mod-icon name="r_thumb_up" size="sm" />```
material-icons-sharp | s_ |  ```<mod-icon name="s_thumb_up" size="sm" />```
material-symbols-outlined | sym_o_ |  ```<mod-icon name="sym_o_thumb_up" size="sm" />```
material-symbols-rounded | sym_r_ |  ```<mod-icon name="sym_r_o_thumb_up" size="sm" />```
material-symbols-sharp | sym_s_ |  ```<mod-icon name="sym_s_o_thumb_up" size="sm" />```
ionicons-v4 | ion-, ion-md-, ion-ios-, ion-logo- |  ```<mod-icon name="ion-heart" size="sm" />```
ionicons-v5 | ion- |  ```<mod-icon name="ion-heart" size="sm" />```
fontawesome-v5 | fa[s,r,l,d,b] fa- |  ```<mod-icon name="fas fa-ambulance" size="sm" />```
fontawesome-v6 | fa[s,r,l,d,b] fa- or fa-[solid,regular,brands] |  “fas fa-ambulance” or “fa-solid fa-ambulance”
mdi-v5/v4/v3 | mdi- |  ```<mod-icon name="mdi-alert-circle-outline" size="sm" />```
mdi-v6 | mdi- |  ```<mod-icon name="mdi-alert-circle-outline" size="sm" />```
eva-icons | eva- |  ```<mod-icon name="eva-shield-outline" size="sm" />```
themify | ti- |  ```<mod-icon name="ti-hand-point-up" size="sm" />```
line-awesome | la[s,r,l,d,b] la- |  ```<mod-icon name="las la-atom" size="sm" />```
bootstrap-icons | bi- |  ```<mod-icon name="bi-bug-fill" size="sm" />```