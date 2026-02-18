import { createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';
import { useAuthStore } from '../store/authStore';

useAuthStore.getState().init();

const router = createBrowserRouter(routes);

export default router;
