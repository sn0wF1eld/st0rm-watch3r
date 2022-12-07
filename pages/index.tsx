import Form from "../components/form/Form";
import ConnectionsTable from "../components/form/ConnectionsTable";

export default function Home() {
  return (
    <div className='flex flex-col rounded p-5 bg-secondary-bg w-auto ml-6 mr-6'>
      <Form/>
      <ConnectionsTable/>
    </div>
  )
}
