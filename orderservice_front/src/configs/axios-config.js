// 여기에서 axios 인스턴스를 생성하고,
// interceptor 기능을 활용하여, access token이 만료되었을 때 refresh token을 사용하여
// 새로운 access token을 발급받는 비동기 방식의 요청을 모듈화. (fetch는 interceptor 기능 x)
// axios 인스턴스는 token이 필요한 모든 요청에 활용 될 것입니다.

import axios from 'axios';

// Axios 인스턴스 생성
// 이제부터 토큰이 필요한 요청은 그냥 axios가 아니라
// 지금 만드는 이 인스턴스를 이용해 요청을 보내겠다.
const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
Axios Interceptor는 요청 또는 응답이 처리되기 전에 실행되는 코드입니다.
요청을 수정하거나, 응답에 대한 결과 처리를 수행할 수 있습니다.
*/

// 요청용 인터셉터 선언
// 인터셉터의 use는 매개값은 콜백함수 2개를 받음
// 1은 정상 동작 로직
// 2는 과정중 에러 발생 시 실행할 로직
axiosInstance.interceptors.request.use(
  (config) => {
    // 요청 보내기 전에 항상 처리해야할 내용을 콜백으로 전달
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    // 더 이상 비동기 요청이 진행되지 않게 하기 위해
    // reject 호출 시 요청 취소
    Promise.reject(error);
  },
);

// 응답용 인터셉터 설정
axiosInstance.interceptors.response.use(
  // 응답에 문제가 없다면 그대로 응답 객체 리턴
  (response) => {
    return response;
  },
  async (error) => {
    console.log('response Interceptor 동작함! 응답에 문제 발생');
    console.log(error);

    if (error.response.data.message === 'NO_LOGIN') {
      console.log('아예 로그인을 하지 않아서 재발급 요청을 할 수 없음');
      return Promise.reject(error);
    }

    // token 재발급 로직 진행 -> 로그인은 했는데, 만료된거라서
    if (error.response.status === 401) {
      console.log('응답상태 401 발생! 토큰 재발급 필요!');

      try {
        const id = localStorage.getItem('USER_ID');

        const res = await axios.post('http://localhost:8181/user/refresh', {
          id,
        });
      } catch (error) {}
    }
  },
);

export default axiosInstance;
