import Image from 'next/image'
import styles from '@/styles/header.module.css'

export default function Header() {
  return (
      <div className='flex justify-between' >
       <div className='flex m-5'>
         <img
        src="/techvetlogo.jpeg"
        width={80}
        height={80}
        alt='techvetlogo'
        />
       </div>   

       <nav className='m-5'>
        <a className='p-5'>Home</a>
        <a className='p-5'>Cadastro</a>
        <a className='p-5'>Agendamento</a>
       </nav>

      </div>
  );
}
