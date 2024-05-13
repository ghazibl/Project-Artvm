import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble } from 'react-icons/bs';
import { MdOutlinePhoneAndroid, MdOutlineEmail, MdAccessTime } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { useLocation } from 'react-router-dom';

export default function FooterCom() {
  const location = useLocation();

  // Check if the location is the root path "/"
  const isHomePage = location.pathname === '/';

  return (
    <div>
    {isHomePage && (
      <Footer container className='border border-t-8 border-teal-500'>
        <div className='w-full max-w-7xl mx-auto'>
          <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
            <div className='mt-5 mr-20'>
              <Link
                to='/'
                className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'
              >
                <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                  ARTVM
                </span>
              </Link>
            </div>
            <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
              {/* Render content for all pages */}
              <div>
                <Footer.Title title=' À propos de Nous' />
                <Footer.LinkGroup col>
                  <Footer.Link
                    href=''
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Qui sommes-nous ?
                  </Footer.Link>
                  <Footer.Link
                    href='/about'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Conditions générales de vente
                  </Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div>
                <Footer.Title title='NOS CONTACTS' />
                <Footer.LinkGroup col>
                  <Footer.Link
                    href=''
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <MdOutlinePhoneAndroid style={{ marginRight: '5px' }} />28817593
                  </Footer.Link>
                  <Footer.Link href='#' style={{ display: 'flex', alignItems: 'center' }}><MdOutlineEmail style={{ marginRight: '5px' }} />
                    artvm2021@verre-et-deco.fr</Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div>
                <Footer.Title title='INFORMATION' />
                <Footer.LinkGroup col>
                  <Footer.Link href='#' style={{ display: 'flex', alignItems: 'center' }}>
                    <FaLocationDot style={{ marginRight: '5px' }} /> Rue de la Republique, Mahdia 5100
                  </Footer.Link>
                  <Footer.Link href='#' style={{ display: 'flex' }}>
                    <MdAccessTime style={{ marginRight: '5px', fontSize: "1.4em" }} />Du lundi au Vendredi : 8h - 12h et 13h30 - 18h
                    Samedi : 8h - 12h</Footer.Link>
                </Footer.LinkGroup>
              </div>
            </div>
          </div>
          <Footer.Divider />
          <div className='w-full sm:flex sm:items-center sm:justify-between'>
            <Footer.Copyright
              href='#'
              by="ARTVM"
              year={new Date().getFullYear()}
            />
            <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
              <Footer.Icon href='#' icon={BsFacebook} />
              <Footer.Icon href='#' icon={BsInstagram} />
              <Footer.Icon href='#' icon={BsTwitter} />
              <Footer.Icon href='https://github.com/sahandghavidel' icon={BsGithub} />
              <Footer.Icon href='#' icon={BsDribbble} />
            </div>
          </div>
        </div>
      </Footer>
    )}
    </div>
  );
}
