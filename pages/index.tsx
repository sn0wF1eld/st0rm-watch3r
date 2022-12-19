import Form from "../components/form/Form";
import ConnectionsTable from "../components/form/ConnectionsTable";

export default function Home() {
  return (
    <div className='flex flex-col gap-10 box-content p-5 w-auto'>
      <Form/>
      <ConnectionsTable/>
    </div>
  )
}
