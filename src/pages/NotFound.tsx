import { Link } from 'react-router';
import { Container } from '../components/Container';
import { ArrowLeftIcon } from '../components/icons';

export default function NotFound() {

  return (
    <Container className="flex flex-col items-start py-32">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">This page doesn't exist.</h1>
      <p className="mt-4 max-w-md text-lg text-muted">The link may be broken, or the page may have moved.</p>
      <Link to="/" data-magnetic className="btn btn-primary group mt-10">
        <ArrowLeftIcon size={16} className="transition-transform group-hover:-translate-x-0.5" /> Back home
      </Link>
    </Container>
  );
}
