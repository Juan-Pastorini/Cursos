import { getCursos } from './lib/api';
import HomeClient from './components/HomeClient';

export default async function Home() {
  let cursos = [];
  try {
    const response = await getCursos();
    if (response.success && response.data) {
      cursos = response.data.sort((a, b) => (b.inscriptos || 0) - (a.inscriptos || 0));
    }
  } catch (error) {
    console.error('Error al traer los cursos:', error);
  }

  return <HomeClient initialCursos={cursos} />;
}

