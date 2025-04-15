// 微信登录配置
export const wechatConfig = {
  appId: 'your_wechat_app_id',  // 替换为实际的微信应用ID
  redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '',
};

// 微信登录状态
export interface WechatAuthResponse {
  code: string;
  state?: string;
}

// 微信用户信息接口
export interface WechatUserInfo {
  openid: string;
  nickname: string;
  headimgurl: string;
  unionid?: string;
}