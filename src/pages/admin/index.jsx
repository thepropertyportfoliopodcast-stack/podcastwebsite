export default function AdminIndex() {
  return null;
}

export async function getServerSideProps() {
  return {
    redirect: { destination: "/admin/podcast", permanent: false },
  };
}
