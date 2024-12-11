import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ListsOfShoppingLists from './components/ListsOfShoppingLists';
import ProductList from './components/ProductList';
import Onboarding from './components/Onboarding'; // Импортируем Onboarding

function App() {
  return (
    <Router> {/* Обертываем в Router */}
      <Routes>
        {/* Главная страница - отображаем Onboarding */}
        <Route path="/" element={<Onboarding />} />

        {/* Маршрут для отображения списка покупок */}
        <Route path="/shopping-lists" element={<ListsOfShoppingLists />} />

        {/* Маршрут для страницы списка товаров */}
        <Route path="/product-list/:listId" element={<ProductList />} />

        {/* Маршрут для несуществующих страниц */}
        <Route path="*" element={<div>Страница не найдена</div>} />
      </Routes>
    </Router>
  );
}

export default App;
