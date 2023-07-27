<template>
  <div class="row">
    <content-header></content-header>
    <div class="col-12 bg-mod-card rounded-sm">
      <div class="row q-pa-md">
        <div style="display: flex; justify-content: center; align-items: center; padding-right: 10px">
          <div style="height: 10px; width: 10px; background-color: #242E42"></div>
        </div>
        <div style="padding-right: 18px">已分配网段</div>
        <div style="display: flex; justify-content: center; align-items: center; padding-right: 10px">
          <div style="height: 10px; width: 10px; background-color: #55BC8A"></div>
        </div>
        <div>未分配网段</div>
        <div id="treeMap" style="height: 680px; width: 100%"></div>
      </div>
    </div>
  </div>
</template>

<script>
import ContentHeader from '@/components/contentHeader/header'

export default {
  name: 'ip',
  components: {
    ContentHeader
  },
  data () {
    return {
      json_data: [
        {
          id: '10.119.10.0/24',
          value: 256,
          name: '10.119.10.0/24',
          children: [{
            id: '10.119.10.0/27',
            name: '10.119.10.0/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.119.10.32/27',
            name: '10.119.10.32/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.119.10.64/27',
            name: '10.119.10.64/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.119.10.96/27',
            name: '10.119.10.96/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.119.10.128/27',
            name: '10.119.10.128/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.119.10.160/27',
            name: '10.119.10.160/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.119.10.192/26',
            name: '10.119.10.192/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.119.22.0/24',
          value: 256,
          name: '10.119.22.0/24',
          children: [{
            id: '10.119.22.192/26',
            name: '10.119.22.192/26',
            value: 64,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.119.22.0/25',
            name: '10.119.22.0/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.119.22.128/26',
            name: '10.119.22.128/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.119.24.0/24',
          value: 256,
          name: '10.119.24.0/24',
          children: [{
            id: '10.119.24.0/26',
            name: '10.119.24.0/26',
            value: 64,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.119.24.64/26',
            name: '10.119.24.64/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.119.24.128/25',
            name: '10.119.24.128/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.119.67.0/24',
          value: 256,
          name: '10.119.67.0/24',
          children: [{
            id: '10.119.67.128/28',
            name: '10.119.67.128/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.119.67.0/25',
            name: '10.119.67.0/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.119.67.144/28',
            name: '10.119.67.144/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.119.67.160/27',
            name: '10.119.67.160/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.119.67.192/26',
            name: '10.119.67.192/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.119.88.0/24',
          value: 256,
          name: '10.119.88.0/24',
          children: [{
            id: '10.119.88.160/27',
            name: '10.119.88.160/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.119.88.0/25',
            name: '10.119.88.0/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.119.88.128/27',
            name: '10.119.88.128/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.119.88.192/26',
            name: '10.119.88.192/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.119.9.0/24',
          value: 256,
          name: '10.119.9.0/24',
          children: [{
            id: '10.119.9.160/27',
            name: '10.119.9.160/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.119.9.192/27',
            name: '10.119.9.192/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.119.9.224/27',
            name: '10.119.9.224/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.119.9.0/25',
            name: '10.119.9.0/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.119.9.128/27',
            name: '10.119.9.128/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.192.247.0/24',
          value: 256,
          name: '10.192.247.0/24',
          children: [{
            id: '10.192.247.192/28',
            name: '10.192.247.192/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.192.247.0/25',
            name: '10.192.247.0/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.192.247.128/26',
            name: '10.192.247.128/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.192.247.208/28',
            name: '10.192.247.208/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.192.247.224/27',
            name: '10.192.247.224/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.239.160.0/24',
          value: 256,
          name: '10.239.160.0/24',
          children: [{
            id: '10.239.160.0/27',
            name: '10.239.160.0/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.160.32/27',
            name: '10.239.160.32/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.239.160.64/26',
            name: '10.239.160.64/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.239.160.128/25',
            name: '10.239.160.128/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.239.166.0/24',
          value: 256,
          name: '10.239.166.0/24',
          children: [{
            id: '10.239.166.128/27',
            name: '10.239.166.128/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.166.0/25',
            name: '10.239.166.0/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.239.166.160/27',
            name: '10.239.166.160/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.239.166.192/26',
            name: '10.239.166.192/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.239.169.0/24',
          value: 256,
          name: '10.239.169.0/24',
          children: [{
            id: '10.239.169.144/29',
            name: '10.239.169.144/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.169.192/29',
            name: '10.239.169.192/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.169.152/29',
            name: '10.239.169.152/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.169.160/29',
            name: '10.239.169.160/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.169.200/29',
            name: '10.239.169.200/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.169.176/29',
            name: '10.239.169.176/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.169.136/29',
            name: '10.239.169.136/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.169.168/29',
            name: '10.239.169.168/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.169.184/29',
            name: '10.239.169.184/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.169.128/29',
            name: '10.239.169.128/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.169.0/25',
            name: '10.239.169.0/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.239.169.208/28',
            name: '10.239.169.208/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.239.169.224/27',
            name: '10.239.169.224/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.239.184.0/24',
          value: 256,
          name: '10.239.184.0/24',
          children: [{
            id: '10.239.184.128/28',
            name: '10.239.184.128/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.184.208/29',
            name: '10.239.184.208/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.184.248/29',
            name: '10.239.184.248/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.184.0/25',
            name: '10.239.184.0/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.239.184.144/28',
            name: '10.239.184.144/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.239.184.160/27',
            name: '10.239.184.160/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.239.184.192/28',
            name: '10.239.184.192/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.239.184.216/29',
            name: '10.239.184.216/29',
            value: 8,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.239.184.224/28',
            name: '10.239.184.224/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.239.184.240/29',
            name: '10.239.184.240/29',
            value: 8,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.239.193.0/24',
          value: 256,
          name: '10.239.193.0/24',
          children: [{
            id: '10.239.193.144/28',
            name: '10.239.193.144/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.193.128/28',
            name: '10.239.193.128/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.193.160/29',
            name: '10.239.193.160/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.193.176/29',
            name: '10.239.193.176/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.193.192/26',
            name: '10.239.193.192/26',
            value: 64,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.193.0/25',
            name: '10.239.193.0/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.239.193.168/29',
            name: '10.239.193.168/29',
            value: 8,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.239.193.184/29',
            name: '10.239.193.184/29',
            value: 8,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.239.197.0/24',
          value: 256,
          name: '10.239.197.0/24',
          children: [{
            id: '10.239.197.96/28',
            name: '10.239.197.96/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.197.48/28',
            name: '10.239.197.48/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.197.64/28',
            name: '10.239.197.64/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.197.80/28',
            name: '10.239.197.80/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.197.0/28',
            name: '10.239.197.0/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.197.16/28',
            name: '10.239.197.16/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.197.32/28',
            name: '10.239.197.32/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.197.112/28',
            name: '10.239.197.112/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.239.197.128/25',
            name: '10.239.197.128/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.239.199.0/24',
          value: 256,
          name: '10.239.199.0/24',
          children: [{
            id: '10.239.199.0/26',
            name: '10.239.199.0/26',
            value: 64,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.199.64/26',
            name: '10.239.199.64/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.239.199.128/25',
            name: '10.239.199.128/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.239.208.0/24',
          value: 256,
          name: '10.239.208.0/24',
          children: [{
            id: '10.239.208.16/29',
            name: '10.239.208.16/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.208.32/27',
            name: '10.239.208.32/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.208.24/29',
            name: '10.239.208.24/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.208.64/28',
            name: '10.239.208.64/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.208.0/28',
            name: '10.239.208.0/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.239.208.80/28',
            name: '10.239.208.80/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.239.208.96/27',
            name: '10.239.208.96/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.239.208.128/25',
            name: '10.239.208.128/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.239.232.0/24',
          value: 256,
          name: '10.239.232.0/24',
          children: [{
            id: '10.239.232.0/28',
            name: '10.239.232.0/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.239.232.16/28',
            name: '10.239.232.16/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.239.232.32/27',
            name: '10.239.232.32/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.239.232.64/26',
            name: '10.239.232.64/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.239.232.128/25',
            name: '10.239.232.128/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.242.141.0/24',
          value: 256,
          name: '10.242.141.0/24',
          children: [{
            id: '10.242.141.0/29',
            name: '10.242.141.0/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.242.141.8/29',
            name: '10.242.141.8/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.242.141.192/28',
            name: '10.242.141.192/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.242.141.80/29',
            name: '10.242.141.80/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.242.141.32/27',
            name: '10.242.141.32/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.242.141.24/29',
            name: '10.242.141.24/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.242.141.88/29',
            name: '10.242.141.88/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.242.141.16/29',
            name: '10.242.141.16/29',
            value: 8,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.242.141.64/28',
            name: '10.242.141.64/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.242.141.96/27',
            name: '10.242.141.96/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.242.141.128/26',
            name: '10.242.141.128/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.242.141.208/28',
            name: '10.242.141.208/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.242.141.224/27',
            name: '10.242.141.224/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.242.185.0/24',
          value: 256,
          name: '10.242.185.0/24',
          children: [{
            id: '10.242.185.128/27',
            name: '10.242.185.128/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.242.185.64/28',
            name: '10.242.185.64/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.242.185.112/29',
            name: '10.242.185.112/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.242.185.0/26',
            name: '10.242.185.0/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.242.185.80/28',
            name: '10.242.185.80/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.242.185.96/28',
            name: '10.242.185.96/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.242.185.120/29',
            name: '10.242.185.120/29',
            value: 8,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.242.185.160/27',
            name: '10.242.185.160/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.242.185.192/26',
            name: '10.242.185.192/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.242.191.0/24',
          value: 256,
          name: '10.242.191.0/24',
          children: [{
            id: '10.242.191.0/27',
            name: '10.242.191.0/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.242.191.32/27',
            name: '10.242.191.32/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.242.191.64/26',
            name: '10.242.191.64/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.242.191.128/25',
            name: '10.242.191.128/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.242.217.0/24',
          value: 256,
          name: '10.242.217.0/24',
          children: [{
            id: '10.242.217.128/29',
            name: '10.242.217.128/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.242.217.0/25',
            name: '10.242.217.0/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.242.217.136/29',
            name: '10.242.217.136/29',
            value: 8,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.242.217.144/28',
            name: '10.242.217.144/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.242.217.160/27',
            name: '10.242.217.160/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.242.217.192/26',
            name: '10.242.217.192/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.25.65.0/24',
          value: 256,
          name: '10.25.65.0/24',
          children: [{
            id: '10.25.65.128/27',
            name: '10.25.65.128/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.25.65.0/29',
            name: '10.25.65.0/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.25.65.8/29',
            name: '10.25.65.8/29',
            value: 8,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.25.65.16/28',
            name: '10.25.65.16/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.25.65.32/27',
            name: '10.25.65.32/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.25.65.64/26',
            name: '10.25.65.64/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.25.65.160/27',
            name: '10.25.65.160/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.25.65.192/26',
            name: '10.25.65.192/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.25.66.0/24',
          value: 256,
          name: '10.25.66.0/24',
          children: [{
            id: '10.25.66.0/29',
            name: '10.25.66.0/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.25.66.8/29',
            name: '10.25.66.8/29',
            value: 8,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.25.66.16/28',
            name: '10.25.66.16/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.25.66.32/27',
            name: '10.25.66.32/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.25.66.64/26',
            name: '10.25.66.64/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.25.66.128/25',
            name: '10.25.66.128/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.254.168.0/24',
          value: 256,
          name: '10.254.168.0/24',
          children: [{
            id: '10.254.168.192/27',
            name: '10.254.168.192/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.254.168.176/28',
            name: '10.254.168.176/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.254.168.0/25',
            name: '10.254.168.0/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.254.168.128/27',
            name: '10.254.168.128/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.254.168.160/28',
            name: '10.254.168.160/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.254.168.224/27',
            name: '10.254.168.224/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.254.191.0/24',
          value: 256,
          name: '10.254.191.0/24',
          children: [{
            id: '10.254.191.200/29',
            name: '10.254.191.200/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.254.191.0/25',
            name: '10.254.191.0/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.254.191.128/26',
            name: '10.254.191.128/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.254.191.192/29',
            name: '10.254.191.192/29',
            value: 8,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.254.191.208/28',
            name: '10.254.191.208/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.254.191.224/27',
            name: '10.254.191.224/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.36.145.0/24',
          value: 256,
          name: '10.36.145.0/24',
          children: [{
            id: '10.36.145.192/28',
            name: '10.36.145.192/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.36.145.208/28',
            name: '10.36.145.208/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.36.145.168/29',
            name: '10.36.145.168/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.36.145.224/27',
            name: '10.36.145.224/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.36.145.176/29',
            name: '10.36.145.176/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.36.145.0/25',
            name: '10.36.145.0/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.36.145.128/27',
            name: '10.36.145.128/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.36.145.160/29',
            name: '10.36.145.160/29',
            value: 8,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.36.145.184/29',
            name: '10.36.145.184/29',
            value: 8,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.36.147.0/24',
          value: 256,
          name: '10.36.147.0/24',
          children: [{
            id: '10.36.147.32/28',
            name: '10.36.147.32/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.36.147.48/28',
            name: '10.36.147.48/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.36.147.0/28',
            name: '10.36.147.0/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.36.147.16/28',
            name: '10.36.147.16/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.36.147.64/26',
            name: '10.36.147.64/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.36.147.128/25',
            name: '10.36.147.128/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.36.24.0/24',
          value: 256,
          name: '10.36.24.0/24',
          children: [{
            id: '10.36.24.16/29',
            name: '10.36.24.16/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.36.24.24/29',
            name: '10.36.24.24/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.36.24.0/29',
            name: '10.36.24.0/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.36.24.8/29',
            name: '10.36.24.8/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.36.24.32/29',
            name: '10.36.24.32/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.36.24.40/29',
            name: '10.36.24.40/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.36.24.48/28',
            name: '10.36.24.48/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.36.24.64/26',
            name: '10.36.24.64/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.36.24.128/25',
            name: '10.36.24.128/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.36.240.0/24',
          value: 256,
          name: '10.36.240.0/24',
          children: [{
            id: '10.36.240.32/28',
            name: '10.36.240.32/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.36.240.0/27',
            name: '10.36.240.0/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.36.240.48/28',
            name: '10.36.240.48/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.36.240.64/26',
            name: '10.36.240.64/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.36.240.128/25',
            name: '10.36.240.128/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.36.38.0/24',
          value: 256,
          name: '10.36.38.0/24',
          children: [{
            id: '10.36.38.16/28',
            name: '10.36.38.16/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.36.38.0/28',
            name: '10.36.38.0/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.36.38.32/27',
            name: '10.36.38.32/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.36.38.64/26',
            name: '10.36.38.64/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.36.38.128/25',
            name: '10.36.38.128/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.36.91.0/24',
          value: 256,
          name: '10.36.91.0/24',
          children: [{
            id: '10.36.91.136/29',
            name: '10.36.91.136/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.36.91.128/29',
            name: '10.36.91.128/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.36.91.144/29',
            name: '10.36.91.144/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.36.91.0/25',
            name: '10.36.91.0/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.36.91.152/29',
            name: '10.36.91.152/29',
            value: 8,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.36.91.160/27',
            name: '10.36.91.160/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.36.91.192/26',
            name: '10.36.91.192/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.36.95.0/24',
          value: 256,
          name: '10.36.95.0/24',
          children: [{
            id: '10.36.95.128/28',
            name: '10.36.95.128/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.36.95.144/28',
            name: '10.36.95.144/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.36.95.0/25',
            name: '10.36.95.0/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.36.95.160/27',
            name: '10.36.95.160/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.36.95.192/26',
            name: '10.36.95.192/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.54.177.0/24',
          value: 256,
          name: '10.54.177.0/24',
          children: [{
            id: '10.54.177.128/27',
            name: '10.54.177.128/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.54.177.176/28',
            name: '10.54.177.176/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.54.177.192/28',
            name: '10.54.177.192/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.54.177.160/28',
            name: '10.54.177.160/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.54.177.208/28',
            name: '10.54.177.208/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.54.177.0/25',
            name: '10.54.177.0/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.54.177.224/27',
            name: '10.54.177.224/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.54.247.0/24',
          value: 256,
          name: '10.54.247.0/24',
          children: [{
            id: '10.54.247.128/27',
            name: '10.54.247.128/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.54.247.176/29',
            name: '10.54.247.176/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.54.247.160/28',
            name: '10.54.247.160/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.54.247.0/25',
            name: '10.54.247.0/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.54.247.184/29',
            name: '10.54.247.184/29',
            value: 8,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.54.247.192/26',
            name: '10.54.247.192/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.54.71.0/24',
          value: 256,
          name: '10.54.71.0/24',
          children: [{
            id: '10.54.71.0/25',
            name: '10.54.71.0/25',
            value: 128,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.54.71.128/29',
            name: '10.54.71.128/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.54.71.136/29',
            name: '10.54.71.136/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.54.71.144/28',
            name: '10.54.71.144/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.54.71.160/27',
            name: '10.54.71.160/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.54.71.192/26',
            name: '10.54.71.192/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.54.74.0/24',
          value: 256,
          name: '10.54.74.0/24',
          children: [{
            id: '10.54.74.136/29',
            name: '10.54.74.136/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.54.74.128/29',
            name: '10.54.74.128/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.54.74.144/29',
            name: '10.54.74.144/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.54.74.0/25',
            name: '10.54.74.0/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.54.74.152/29',
            name: '10.54.74.152/29',
            value: 8,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.54.74.160/27',
            name: '10.54.74.160/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.54.74.192/26',
            name: '10.54.74.192/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '10.69.152.0/24',
          value: 256,
          name: '10.69.152.0/24',
          children: [{
            id: '10.69.152.0/29',
            name: '10.69.152.0/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '10.69.152.8/29',
            name: '10.69.152.8/29',
            value: 8,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.69.152.16/28',
            name: '10.69.152.16/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.69.152.32/27',
            name: '10.69.152.32/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.69.152.64/26',
            name: '10.69.152.64/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '10.69.152.128/25',
            name: '10.69.152.128/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '120.196.209.0/24',
          value: 256,
          name: '120.196.209.0/24',
          children: [{
            id: '120.196.209.32/28',
            name: '120.196.209.32/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '120.196.209.192/27',
            name: '120.196.209.192/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '120.196.209.48/28',
            name: '120.196.209.48/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '120.196.209.224/27',
            name: '120.196.209.224/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '120.196.209.64/28',
            name: '120.196.209.64/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '120.196.209.80/28',
            name: '120.196.209.80/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '120.196.209.96/28',
            name: '120.196.209.96/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '120.196.209.112/28',
            name: '120.196.209.112/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '120.196.209.0/28',
            name: '120.196.209.0/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '120.196.209.128/27',
            name: '120.196.209.128/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '120.196.209.16/28',
            name: '120.196.209.16/28',
            value: 16,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '120.196.209.160/27',
            name: '120.196.209.160/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          }]
        },
        {
          id: '120.198.247.0/24',
          value: 256,
          name: '120.198.247.0/24',
          children: [{
            id: '120.198.247.192/26',
            name: '120.198.247.192/26',
            value: 64,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '120.198.247.160/29',
            name: '120.198.247.160/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '120.198.247.0/25',
            name: '120.198.247.0/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '120.198.247.128/27',
            name: '120.198.247.128/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '120.198.247.168/29',
            name: '120.198.247.168/29',
            value: 8,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '120.198.247.176/28',
            name: '120.198.247.176/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '120.198.251.0/24',
          value: 256,
          name: '120.198.251.0/24',
          children: [{
            id: '120.198.251.0/27',
            name: '120.198.251.0/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '120.198.251.32/27',
            name: '120.198.251.32/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '120.198.251.64/27',
            name: '120.198.251.64/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '120.198.251.96/27',
            name: '120.198.251.96/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '120.198.251.128/25',
            name: '120.198.251.128/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '172.16.41.0/24',
          value: 256,
          name: '172.16.41.0/24',
          children: [{
            id: '172.16.41.160/27',
            name: '172.16.41.160/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '172.16.41.0/25',
            name: '172.16.41.0/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '172.16.41.128/27',
            name: '172.16.41.128/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '172.16.41.192/26',
            name: '172.16.41.192/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '192.168.1.0/24',
          value: 256,
          name: '192.168.1.0/24',
          children: [{
            id: '192.168.1.0/24',
            name: '192.168.1.0/24',
            value: 256,
            itemStyle: {
              color: '#242E42'
            }
          }]
        },
        {
          id: '192.168.182.0/24',
          value: 256,
          name: '192.168.182.0/24',
          children: [{
            id: '192.168.182.0/29',
            name: '192.168.182.0/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.182.8/29',
            name: '192.168.182.8/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.182.64/27',
            name: '192.168.182.64/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.182.128/25',
            name: '192.168.182.128/25',
            value: 128,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.182.16/28',
            name: '192.168.182.16/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '192.168.182.32/27',
            name: '192.168.182.32/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '192.168.182.96/27',
            name: '192.168.182.96/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '192.168.183.0/24',
          value: 256,
          name: '192.168.183.0/24',
          children: [{
            id: '192.168.183.0/25',
            name: '192.168.183.0/25',
            value: 128,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.183.128/25',
            name: '192.168.183.128/25',
            value: 128,
            itemStyle: {
              color: '#242E42'
            }
          }]
        },
        {
          id: '192.168.184.0/24',
          value: 256,
          name: '192.168.184.0/24',
          children: [{
            id: '192.168.184.128/26',
            name: '192.168.184.128/26',
            value: 64,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.184.0/26',
            name: '192.168.184.0/26',
            value: 64,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.184.64/26',
            name: '192.168.184.64/26',
            value: 64,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.184.192/26',
            name: '192.168.184.192/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '192.168.190.0/24',
          value: 256,
          name: '192.168.190.0/24',
          children: [{
            id: '192.168.190.96/27',
            name: '192.168.190.96/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.190.64/27',
            name: '192.168.190.64/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.190.0/26',
            name: '192.168.190.0/26',
            value: 64,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.190.128/25',
            name: '192.168.190.128/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '192.168.191.0/24',
          value: 256,
          name: '192.168.191.0/24',
          children: [{
            id: '192.168.191.128/25',
            name: '192.168.191.128/25',
            value: 128,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.191.0/25',
            name: '192.168.191.0/25',
            value: 128,
            itemStyle: {
              color: '#242E42'
            }
          }]
        },
        {
          id: '192.168.251.0/24',
          value: 256,
          name: '192.168.251.0/24',
          children: [{
            id: '192.168.251.8/29',
            name: '192.168.251.8/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.251.0/29',
            name: '192.168.251.0/29',
            value: 8,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.251.16/28',
            name: '192.168.251.16/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '192.168.251.32/27',
            name: '192.168.251.32/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '192.168.251.64/26',
            name: '192.168.251.64/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '192.168.251.128/25',
            name: '192.168.251.128/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '192.168.253.0/24',
          value: 256,
          name: '192.168.253.0/24',
          children: [{
            id: '192.168.253.0/30',
            name: '192.168.253.0/30',
            value: 4,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.253.4/30',
            name: '192.168.253.4/30',
            value: 4,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '192.168.253.8/29',
            name: '192.168.253.8/29',
            value: 8,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '192.168.253.16/28',
            name: '192.168.253.16/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '192.168.253.32/27',
            name: '192.168.253.32/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '192.168.253.64/26',
            name: '192.168.253.64/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '192.168.253.128/25',
            name: '192.168.253.128/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '192.168.254.0/24',
          value: 256,
          name: '192.168.254.0/24',
          children: [{
            id: '192.168.254.224/27',
            name: '192.168.254.224/27',
            value: 32,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.254.0/25',
            name: '192.168.254.0/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '192.168.254.128/26',
            name: '192.168.254.128/26',
            value: 64,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '192.168.254.192/27',
            name: '192.168.254.192/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        },
        {
          id: '192.168.99.0/24',
          value: 256,
          name: '192.168.99.0/24',
          children: [{
            id: '192.168.99.0/30',
            name: '192.168.99.0/30',
            value: 4,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.99.4/30',
            name: '192.168.99.4/30',
            value: 4,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.99.8/30',
            name: '192.168.99.8/30',
            value: 4,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.99.12/30',
            name: '192.168.99.12/30',
            value: 4,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.99.16/30',
            name: '192.168.99.16/30',
            value: 4,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.99.20/30',
            name: '192.168.99.20/30',
            value: 4,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.99.24/30',
            name: '192.168.99.24/30',
            value: 4,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.99.28/30',
            name: '192.168.99.28/30',
            value: 4,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.99.32/30',
            name: '192.168.99.32/30',
            value: 4,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.99.36/30',
            name: '192.168.99.36/30',
            value: 4,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.99.40/30',
            name: '192.168.99.40/30',
            value: 4,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.99.44/30',
            name: '192.168.99.44/30',
            value: 4,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.99.48/30',
            name: '192.168.99.48/30',
            value: 4,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.99.52/30',
            name: '192.168.99.52/30',
            value: 4,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.99.56/30',
            name: '192.168.99.56/30',
            value: 4,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.99.60/30',
            name: '192.168.99.60/30',
            value: 4,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.99.64/30',
            name: '192.168.99.64/30',
            value: 4,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.99.68/30',
            name: '192.168.99.68/30',
            value: 4,
            itemStyle: {
              color: '#242E42'
            }
          },
          {
            id: '192.168.99.72/29',
            name: '192.168.99.72/29',
            value: 8,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '192.168.99.80/28',
            name: '192.168.99.80/28',
            value: 16,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '192.168.99.96/27',
            name: '192.168.99.96/27',
            value: 32,
            itemStyle: {
              color: '#55BC8A'
            }
          },
          {
            id: '192.168.99.128/25',
            name: '192.168.99.128/25',
            value: 128,
            itemStyle: {
              color: '#55BC8A'
            }
          }]
        }
      ]
    }
  },
  mounted () {
    this.initChart()
    const that = this
    window.addEventListener('resize', function () {
      that.initChart().resize()
    })
  },
  methods: {
    initChart () {
      const treeMapChart = this.$echarts.init(document.getElementById('treeMap'))
      const formatUtil = this.$echarts.format
      const option = {
        title: {
          text: '00A资源池-IP资源管理',
          left: 'center'
        },
        tooltip: {
          formatter: function (info) {
            const value = info.value
            const treePathInfo = info.treePathInfo
            const treePath = []
            for (let i = 1; i < treePathInfo.length; i++) {
              treePath.push(treePathInfo[i].name)
            }
            let status = ''
            if (info.color === '#55BC8A') {
              status = '未占用网段'
            } else {
              status = '已占用网段'
            }
            return [
              formatUtil.addCommas(status),
              '<div class="tooltip-title">' +
              formatUtil.encodeHTML(treePath.join('--->')) +
              '</div>',
              'IP数量: ' + formatUtil.addCommas(value) + ' 个'
            ].join('')
          }
        },
        series: [
          {
            name: '00A资源池-IP资源管理',
            type: 'treemap',
            levels: [{
              itemStyle: {
                borderWidth: 4,
                gapWidth: 4
              }
            }],
            label: {
              show: true,
              formatter: '{b}'
            },
            itemStyle: {
              borderColor: '#fff'
            },
            data: this.json_data
          }
        ]
      }
      treeMapChart.setOption(option)
    }
  }
}
</script>

<style scoped>

</style>
