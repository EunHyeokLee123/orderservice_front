import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import './App.css';
import MemberCreate from './components/MemberCreate';
import AuthContext, { AuthContextProvider } from './context/UserContext';
import LoginPage from './components/LoginPage';
import ProductList from './components/ProductList';
import { CartContextProvider } from './context/CartContext';
import OrderPage from './components/OrderPage';
import MyPage from './components/MyPage';

const App = () => {
  return (
    <AuthContextProvider>
      <CartContextProvider>
        <div className='App'>
          <Header />
          <div className='content-wrapper'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/member/create' element={<MemberCreate />} />
              <Route path='/product/list' element={<ProductList />} />
              <Route path='/order/cart' element={<OrderPage />} />
              <Route path='/mypage' element={<MyPage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </CartContextProvider>
    </AuthContextProvider>
  );
};

export default App;
