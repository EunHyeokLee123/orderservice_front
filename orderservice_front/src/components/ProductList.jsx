import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  Grid,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/UserContext';

const ProductList = ({ pageTitle }) => {
  const [searchType, setSearchType] = useState('optional');
  const [searchValue, setSearchValue] = useState('');
  const [productList, setProductList] = useState([]);
  const [selected, setSelected] = useState({});

  const { userRole } = useContext(AuthContext);
  const isAdmin = userRole === 'ADMIN';

  useEffect(() => {
    loadProduct();
  }, []);

  // 상품 목록을 백엔드에 요청하는 함수
  const loadProduct = async (number, size) => {
    const res = await fetch('http://localhost:8181/product/list');
    const data = await res.json();

    // 전달받은 상품 리스트를 상품 목록 상태변수에 세팅
    setProductList(data.result);
  };

  // 장바구니 클릭 이벤트 핸들러
  const handleAddToCart = () => {
    // 특정 객체에서 key값만 뽑아서 문자열 배열로 리턴해주는 메소드
    const selectedProduct = Object.keys(selected);

    // key값만 뽑아서 selected에 들어있는 상품 중에 false는 제거하고 true만 카트에 담자.
    const filtered = selectedProduct.filter((key) => selected[key]);

    // 사용자가 선택한 수량까지 파악해서 장바구니에 넣어주자.
    const finalSelected = filtered.map((key) => {
      const product = productList.find((p) => p.id === parseInt(key));
      return {
        id: product.id,
        name: product.name,
        quantity: product.quantity,
      };
    });
    console.log(finalSelected);
    if (finalSelected.length < 1) {
      alert('장바구니에 담을 상품을 선택하세요.');
      return;
    }

    for (let p of finalSelected) {
      if (p.quantity) {
        alert('수량이 0개인 상품은 담을 수 없습니다.');
        return;
      }
    }

    if (confirm('상품을 장바구니에 추가하시겠습니까?')) {
      // 카트로 상품을 보내주자.
      alert('선택한 상품이 장바구니에 추가되었습니다.');
    }
  };

  // 체크박스 클릭 이벤트 핸들러
  const handleCheckboxChange = (productId, checked) => {
    // 사용자가 특정 상품을 선택했는지에 대한 상태를 관리
    setSelected((prev) => ({
      ...prev,
      [productId]: checked,
    }));
  };

  console.log(selected);
  console.log(productList);

  return (
    <Container>
      <Grid
        container
        justifyContent='space-between'
        spacing={2}
        className='mt-5'
      >
        <Grid item>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loadProduct();
            }}
          >
            <Grid container spacing={2}>
              <Grid item>
                <Select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value='optional'>선택</MenuItem>
                  <MenuItem value='name'>상품명</MenuItem>
                  <MenuItem value='category'>카테고리</MenuItem>
                </Select>
              </Grid>
              <Grid item>
                <TextField
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  label='Search'
                />
              </Grid>
              <Grid item>
                <Button type='submit'>검색</Button>
              </Grid>
            </Grid>
          </form>
        </Grid>

        {!isAdmin && (
          <Grid item>
            <Button onClick={handleAddToCart} color='secondary'>
              장바구니에 담기
            </Button>
          </Grid>
        )}

        {isAdmin && (
          <Grid item>
            <Button href='/product/create' color='success'>
              상품등록
            </Button>
          </Grid>
        )}
      </Grid>

      <Card>
        <CardContent>
          <Typography variant='h6' align='center'>
            {pageTitle}
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>제품사진</TableCell>
                <TableCell>제품명</TableCell>
                <TableCell>가격</TableCell>
                <TableCell>재고수량</TableCell>
                {!isAdmin && <TableCell>주문수량</TableCell>}
                {!isAdmin && <TableCell>주문선택</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {productList.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.imagePath}
                      alt={product.name}
                      style={{ height: '100px', width: 'auto' }}
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.stockQuantity}</TableCell>
                  {!isAdmin && (
                    <TableCell>
                      <TextField
                        type='number'
                        value={product.quantity || 0}
                        // 수량이 변경될 때마다 productList에서 지금 수량이 변경된 상품을 찾아서
                        // quantity라는 새로운 프로퍼티에 값을 세팅하겠다.
                        onChange={(e) =>
                          setProductList((prevList) =>
                            prevList.map((p) =>
                              p.id === product.id
                                ? { ...p, quantity: parseInt(e.target.value) }
                                : p,
                            ),
                          )
                        }
                        style={{ width: '70px' }}
                      />
                    </TableCell>
                  )}
                  {!isAdmin && (
                    <TableCell>
                      <Checkbox
                        // !! -> boolean이 아닌 객체를 truthy, falsy를 통해
                        // boolean 값으로 바꿀 수 있음.
                        checked={!!selected[product.id]}
                        onChange={(e) =>
                          handleCheckboxChange(product.id, e.target.checked)
                        }
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductList;
