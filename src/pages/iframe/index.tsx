import {
  fetchPluginMessage,
  postToFillPluginContent,
  useOnStandalonePluginInit,
} from '@lobehub/chat-plugin-sdk/client';
import { Button } from 'antd';
import { memo, useEffect, useState } from 'react';
import { Center } from 'react-layout-kit';

import Data from '@/components/Render';
import { fetchClothes } from '@/services/clothes';
import { ResponseData } from '@/type';

const Render = memo(() => {
  // 初始化渲染状态
  const [data, setData] = useState<ResponseData>();

  // 初始化时从主应用同步状态
  useEffect(() => {
    fetchPluginMessage().then(setData);
  }, []);

  // 记录请求参数
  const [payload, setPayload] = useState<any>();

  useOnStandalonePluginInit<ResponseData>((payload) => {
    if (payload.func === 'recommendClothes') {
      setPayload(payload.args);
    }
  });

  const fetchData = async () => {
    const data = await fetchClothes(payload);
    setData(data);
    postToFillPluginContent(data);
  };

  return data ? (
    <Data {...data}></Data>
  ) : (
    <Center style={{ height: 150 }}>
      <Button
        disabled={!payload}
        onClick={() => {
          fetchData();
        }}
        type={'primary'}
      >
        查询衣物
      </Button>
    </Center>
  );
});

export default Render;
