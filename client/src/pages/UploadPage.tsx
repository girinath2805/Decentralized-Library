import PublishBook from '@/components/PublishBook';
import UploadDocument from '@/components/UploadDocument';

const UploadPage = () => {

  return (
    <div className='flex justify-between p-12 my-10'>
      <PublishBook/>
      <UploadDocument/>
    </div>
  )
}

export default UploadPage
