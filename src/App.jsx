import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import EditPage from './pages/EditPage';

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/edit/:id" element={<EditPage />} />
        </Routes>
    </BrowserRouter>
);

export default App;
