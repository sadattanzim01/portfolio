import { Link } from 'react-router';
import { Container } from '../components/Container';
import { ArrowLeftIcon } from '../components/icons';

export default function NotFound() {

  return (
    <Container className="flex flex-col items-start py-32">
      <p className="label tabular-nums">Error 404</p>
      <h1 className="text-title mt-3">This page doesn't exist.</h1>
      <p className="mt-4 max-w-md text-lg text-muted">The link may be broken, or the page may have moved.</p>
      <Link to="/" data-magnetic className="btn btn-primary mt-10">
        <ArrowLeftIcon size={16} /> Back home
      </Link>
    </Container>
  );
}
