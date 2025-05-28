import Image from 'next/image'
import styles from '@/styles/header.module.css'

export default function Header() {
  return (
      <div className='flex justify-between' >
       <div className='flex'>
         <img
        src="/techvetlogo.png"
        width={180}
        height={100}
        alt='techvetlogo'
        />
       </div>   

       <nav className='m-5 font-bold'>
        <a className='p-5'>Home</a>
        <a className='p-5'>Cadastro</a>
        <a className='p-5'>Agendamento</a>
       </nav>

      </div>
  );
}
