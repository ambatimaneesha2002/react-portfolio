import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import './App.css';
import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const configJson = require('./portfolioContentConfig.json');

const { projectListArr, iconLinkList } = configJson;
const watchOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.6
}
const { educationListArr, placeholderImg } = configJson;

const watchOptionsForEducation = {
  root: null,
  rootMargin: '0px',
  threshold: 0.6
};
const experiencesListArr = [
  {
    company: "The Tann Mann Gaadi Foundation",
    role: "React js | Internship",
    period: "September 2023 - December 2023",
    side: "left",
  },
  {
    company: "College of Military Engineering",
    role: "Image Processing Intern | Internship",
    period: "August 2023",
    side: "right",
  },
  {
    company: "Campus Ambassador",
    role: "MasterBuddy | Internship",
    period: "July 2023 - August 2023",
    side: "left",
  },
  {
    company: "_VOIS Innovation Marathon",
    role: "Winner of Virtual Mini Internship",
    period: "June 2022 - October 2022",
    side: "right",
  },
];

// Watch options for Intersection Observer
const watchOptionsForExperience = {
  root: null,
  rootMargin: '0px',
  threshold: 0.6,
};


function App() {
  const [errors, setErrors] = useState({});
  const [sectionNavElements, setSectionNavElements] = useState();
  const [sectionElements, setSectionElements] = useState();
  const [techStackIcon] = useState(iconLinkList);
  const [projectList] = useState(projectListArr);
  const [educationList]=useState(educationListArr);
  const [experiencesList] = useState(experiencesListArr);
  const introRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const { top } = introRef.current.getBoundingClientRect();
      if (top < window.innerHeight) {
        introRef.current.classList.add('animate-shock');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const formRef = useRef();
  const aboutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const { top } = aboutRef.current.getBoundingClientRect();
      if (top < window.innerHeight) {
        aboutRef.current.classList.add('animate-fade-in');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const SERVICE_ID = 'service_q1dfvyf';
  const TEMPLATE_ID = 'template_ekuvbwm';
  const PUBLIC_KEY = 'IGn9HDE3zYGPnsn79';

  useEffect(() => {
    const sections = document.querySelectorAll('section');
    const navElements = document.getElementsByClassName('sectionNav')[0]?.getElementsByTagName('li');
    console.log("Sections:", sections);
    console.log("Nav Elements:", navElements);

    setSectionElements(sections);
    setSectionNavElements(navElements);
}, []);

  const updateMenuOnScroll = useCallback((sectionIndex) => {
    if (!sectionNavElements || !sectionNavElements[sectionIndex]) return; // Check if elements exist
    for (let listEl of sectionNavElements) {
        if (listEl.firstChild) { // Check if firstChild exists
            listEl.firstChild.classList.remove('current');
        }
    }
    if (sectionNavElements[sectionIndex].firstChild) {
        sectionNavElements[sectionIndex].firstChild.classList.add('current');
    }
}, [sectionNavElements]);



  // Define sectionWatcherCallback first
const sectionWatcherCallback = useCallback((sections) => {
  sections.forEach((section) => {
      if (!section.isIntersecting) return;
      updateMenuOnScroll(section.target.id);
  });
}, [updateMenuOnScroll]);

// Now use it in useMemo
const sectionWatcher = useMemo(() => {
  return new IntersectionObserver(sectionWatcherCallback, watchOptions);
}, [sectionWatcherCallback]);


  useEffect(() => {
    sectionElements?.forEach((section) => {
      sectionWatcher.observe(section);
    })

    return () => {
      sectionElements?.forEach((section) => {
        sectionWatcher.unobserve(section);
      })
    }
  }, [sectionElements, sectionWatcher]);

  function navigateToSection(sectionIndex) {
    if (sectionIndex === undefined) return;
    updateMenuOnScroll(sectionIndex);

    if (sectionIndex <= sectionElements.length - 1) {
      sectionElements[sectionIndex]?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const validateForm = () => {
    const form = formRef.current;
    const errors = {};
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name) {
      errors.name = "Name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid email address";
    }

    if (!message) {
      errors.message = "Message is required";
    }

    return errors;
  };

  const sendEmail = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      emailjs
        .sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, {
          publicKey: PUBLIC_KEY,
        })
        .then(
          () => {
            showToast("success")
            setErrors({});
            formRef.current.reset();
          },
          (error) => {
            setErrors({});
            showToast("error");
          },
        );
    }
  };

  function showToast(toastType) {
    if (toastType === 'success') {
      toast.success('Email received', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else if (toastType === 'error') {
      toast.error('Error sending email', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }

  return (
    <main className="w-full h-screen overflow-y-scroll" style={{ 'scrollSnapType': 'y mandatory', 'scrollbarWidth': 'none' }}>
       <section id='0' ref={introRef} className='w-full h-screen p-5 bg-[#f4f9fc] flex flex-col justify-center items-center' style={{ scrollSnapAlign: 'start' }}>
      <h1 className='text-5xl text-center text-blue-500 sm:text-6xl 2xl:text-8xl transform animate-fade-in'>
        <b>Hi, I am <br />Ambati Maneesha</b>
      </h1>
      <ul className='absolute z-30 flex flex-col gap-2 2xl:gap-5 sectionNav right-7 bottom-9 sm:right-14 sm:bottom-11'>
        {Array.from({ length: 4 }).map((_, index) => (
          <li key={index}>
            <button
              className={`w-3 h-3 transition-all rotate-45 border-2 border-blue-700 2xl:w-4 2xl:h-4 ${index === 0 ? 'current' : ''}`}
              onClick={() => navigateToSection(index)}
              data-sectionindex={index}
            ></button>
          </li>
        ))}
      </ul>
      <ul className='absolute left-0 z-30 flex flex-col items-center justify-center gap-4 p-4 bg-white rounded-md shadow-2xl opacity-75 sm:opacity-100 top-2 sm:top-auto shadow-cyan-900'>
        {['github', 'linkedin'].map(social => (
          <li key={social}>
            <a rel="noreferrer" target='_blank' href={techStackIcon[social]}>
              <img alt={social} src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${social}/${social}-original.svg`} className='w-6 h-6 2xl:w-8 2xl:h-8' />
            </a>
          </li>
        ))}
        <li key='email'>
          <a href='mailto:ambatimaneesha552@gmail.com'>
            <img className="w-6 h-6 2xl:w-8 2xl:h-8" src="https://img.icons8.com/color/48/gmail--v1.png" alt="e-mail" />
          </a>
        </li>
      </ul>
      <a href="mailto:ambatimaneesha552@gmail.com?subject=Hi Maneesha, I would like to hire you." className='w-28 fixed 2xl:text-lg cursor-pointer text-center font-bold tracking-widest hover:tracking-[0.3em] transition-all text-blue-500 text-md top-11 right-4 sm:right-11 mix-blend-multiply'>HIRE ME</a>
      <div className='flex flex-row gap-6 text-lg mt-14 2xl:text-2xl 2xl:mt-16'>
        <button onClick={() => navigateToSection(2)} data-sectionindex="2" className='px-3 py-2 font-bold text-blue-500 transition-all border-2 border-blue-500 rounded-lg homeButton hover:bg-blue-500 hover:text-white hover:scale-x-110'>Projects</button>
        <a href={configJson.cv} target='_blank' rel="noreferrer">
          <button className='px-3 py-2 font-bold text-blue-500 transition-all border-2 border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white hover:scale-x-110'>Get my CV</button>
        </a>
      </div>
    </section>
      <section
      id='1'
      ref={aboutRef}
      className='w-full h-screen bg-[#f4f9fc] flex sm:justify-center items-center transition-transform duration-700 transform perspective-1000'
      style={{ scrollSnapAlign: 'start' }}
    >
      <div className='flex text-sm md:text-lg lg:text-base flex-col lg:flex-row gap-6 px-4 lg:px-0 lg:max-w-[1000px] 2xl:text-xl 2xl:max-w-[1300px] 2xl:gap-8'>
        <article className='flex-1 lg:pr-8 text-justify text-[#0f1b61] lg:border-r-2 border-blue-500 2xl:pr-9 transform hover:rotate-y-6 transition duration-300'>
          <h1 className='mb-3 text-3xl font-bold text-blue-600 lg:text-4xl 2xl:mb-5 2xl:text-5xl'>About Me</h1>
          <p className='indent-4'>Hello! I'm Ambati Maneesha, a passionate Full Stack Web Developer based in Pune, India. With a strong foundation in both front-end and back-end technologies, I specialize in creating dynamic, high-performance web applications.</p>
          <p className='indent-4'>I hold a <b>Bachelor of Engineering in Information Technology</b> from Army Institute of Technology.</p>
          <p className='indent-4'>
            I am constantly exploring new technologies and methodologies to stay ahead in the rapidly evolving tech landscape. I am dedicated to delivering top-notch solutions that drive user satisfaction and business success.
            Feel free to explore my <a className="text-blue-600 underline after:content-['_↗']" href={techStackIcon['github']}>GitHub</a> for a closer look at my projects, or connect with me on <a className="text-blue-700 underline after:content-['_↗']" href={techStackIcon['linkedin']}>LinkedIn</a>.
            <br /><span className='block text-center'>Let's create something amazing together!</span>
          </p>
        </article>
        <article className='flex-1 transform hover:rotate-y-6 transition duration-300'>
          <h1 className='mb-3 text-3xl font-bold text-blue-600 lg:text-4xl 2xl:text-5xl 2xl:mb-5'>Skills</h1>
          <ul className='flex gap-2 flex-wrap bg-blue-400 w-fit py-1 px-2 rounded-md text-sm md:text-lg text-white font-semibold 2xl:text-lg'>
            {configJson.skills.map(skill => <li key={skill}>{skill}</li>)}
          </ul>
        </article>
      </div>
    </section>
      <section id='education' className='relative flex flex-col justify-center w-full h-screen gap-8 sm:items-center' style={{ 'scrollSnapAlign': 'start', background: 'linear-gradient(180deg, #3b82f6 50%,#ffffff 50%)' }}>
  <h1 className='absolute top-0 z-10 flex flex-col w-full mt-5 text-4xl font-bold leading-5 text-center text-white uppercase sm:w-auto 2xl:text-5xl 2xl:leading-5'>
    My Education
    <span className="relative flex-col self-center inline-block lowercase sm:self-end before:block -z-10 w-fit before:absolute before:-inset-1 before:-skew-y-3 before:bg-pink-500">
      <span className="relative text-base text-white 2xl:text-lg">academic journey</span>
    </span>
  </h1>
  <div className='absolute project-scroller sm:ml-0 p-4 text-[#0f1b61] content-center h-full items-center sm:flex'>
    {educationList.map((education, index) => (
      <div key={education.name} className='hover:scale-[1.02] duration-[0.3s] select-none project-element project relative inline-block bg-white flex flex-col rounded-lg sm:w-[300px] 2xl:w-[380px] border-2 border-black parentProjectDiv z-20'>
        <img className='bg-gray-100 rounded-t-lg aspect-3/2 object-cover max-h-[224px]' alt='education' src={education.img || 'placeholder-image.png'}></img>
        <div className='p-2 text-sm 2xl:text-lg'>
          <div className='flex justify-between'>
            <div className='flex items-center gap-2'>
              <h2 className='text-lg font-bold text-center 2xl:text-xl'>{education.name}</h2>
              <h1 className={`px-1 text-xs border-2 rounded-xl ${education.completed ? 'bg-green-200 text-green-600 border-green-600' : 'bg-red-200 text-red-600 border-red-600'}`}>
                {education.completed ? 'Completed' : 'Ongoing'}
              </h1>
            </div>
          </div>
          <p className='mt-2'><span className='font-bold'>Location:</span> {education.place}</p>
          <p className='mt-1'><span className='font-bold'>Year:</span> {education['completed-Year']}</p>
        </div>
      </div>
    ))}
  </div>
</section>
      <section id='3' className='relative flex flex-col justify-center w-full h-screen gap-8 sm:items-center' style={{ 'scrollSnapAlign': 'start', background: 'linear-gradient(180deg, #3b82f6 50%,#ffffff 50%)' }}>
        <h1 className='absolute top-0 z-10 flex flex-col w-full mt-5 text-4xl font-bold leading-5 text-center text-white uppercase sm:w-auto 2xl:text-5xl 2xl:leading-5'>
          My work
          <span className="relative flex-col self-center inline-block lowercase sm:self-end before:block -z-10 w-fit before:absolute before:-inset-1 before:-skew-y-3 before:bg-pink-500">
            <span className="relative text-base text-white 2xl:text-lg">awesome projects</span>
          </span></h1>
        <div className='absolute project-scroller sm:ml-0 p-4 text-[#0f1b61] content-center h-full items-center sm:flex'>
          <div className=''></div>
          {projectList.map((project, index) => <div key={project.name} className='hover:scale-[1.02] duration-[0.3s] select-none project-element project relative inline-block bg-white flex flex-col rounded-lg sm:w-[300px] 2xl:w-[380px] border-2 border-black parentProjectDiv z-20'>
            <img className='bg-gray-100 rounded-t-lg aspect-3/2 object-cover max-h-[224px]' alt='project' src={project?.img || 'placeholder-image.png'}></img>
            <div className='absolute flex flex-col gap-3 p-2 bg-white rounded-md techStackDiv -left-10'>
              {project?.techStack.map((tech) => <img key={tech} alt='tech' className='w-5 h-5' src={techStackIcon[tech]} />)}
            </div>
            <div className='p-2 text-sm 2xl:text-lg'>
              <div className='flex justify-between'>
                <div className='flex items-center gap-2'>
                  <h2 className='text-lg font-bold text-center 2xl:text-xl'>{project.name}</h2>
                  <h1 className={`px-1 text-xs border-2 rounded-xl + ${project?.completed ? 'bg-green-200 text-green-600 border-green-600' : 'bg-red-200 text-red-600 border-red-600'}`}>{project?.completed ? 'Live' : 'In Development'}</h1>
                  {project.liveLink && <a rel="noreferrer" target='_blank' href={project.liveLink}><img className='w-4 h-4 hover:scale-105 md:w-5 md:h-5' src="https://img.icons8.com/ios-glyphs/30/external-link.png" alt="external-link" /></a>}
                </div>
                {project.githubLink && <a rel="noreferrer" target='_blank' href={project.githubLink}><img className='w-5 h-5 md:w-6 md:h-6' alt='github' src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" /></a>}
              </div>
              <p className='line-clamp-2 description '><span className='font-bold sm:font-semibold'>Tools used:</span> {project.toolsUsed.join(", ")}</p>
              <p className='line-clamp-3 description '><span className='font-bold sm:font-semibold'>Description:</span> {project.description}</p>
            </div>
          </div>)}
          <div className=''></div>
        </div>
        {/* <div className='relative mx-auto my-auto mb-4 rounded-lg cursor-pointer button'>
          <div className='z-10 px-3 py-2 text-lg font-bold text-blue-500 border-2 border-blue-500 rounded-lg text'>Explore More
          </div>
        </div> */}
      </section>
      <section
      id='experience'
      className='relative flex flex-col justify-center w-full h-screen gap-8 sm:items-center'
      style={{ scrollSnapAlign: 'start', background: 'linear-gradient(180deg, #3b82f6 50%, #ffffff 50%)' }}
    >
      <h1 className='absolute top-0 z-10 flex flex-col w-full mt-5 text-4xl font-bold leading-5 text-center text-white uppercase sm:w-auto 2xl:text-5xl 2xl:leading-5'>
        My Experience
        <span className="relative flex-col self-center inline-block lowercase sm:self-end before:block -z-10 w-fit before:absolute before:-inset-1 before:-skew-y-3 before:bg-pink-500">
          <span className="relative text-base text-white 2xl:text-lg">my journey</span>
        </span>
      </h1>
      <div className='absolute project-scroller sm:ml-0 p-4 text-[#0f1b61] content-center h-full items-center sm:flex'>
        <div className=''></div>
        {experiencesList.map((experience, index) => (
          <div key={index} className={`hover:scale-[1.02] duration-[0.3s] select-none project-element project relative inline-block bg-white flex flex-col rounded-lg sm:w-[300px] 2xl:w-[380px] border-2 border-black parentProjectDiv z-20`}>
            <div className={`p-2 text-sm 2xl:text-lg flex flex-col`}>
              <div className='flex justify-between'>
                <div className='flex items-center gap-2'>
                  <h2 className='text-lg font-bold text-center 2xl:text-xl'>{experience.company}</h2>
                  <h1 className={`px-1 text-xs border-2 rounded-xl ${experience.completed ? 'bg-green-200 text-green-600 border-green-600' : 'bg-red-200 text-red-600 border-red-600'}`}>{experience.completed ? 'Live' : 'In Development'}</h1>
                </div>
              </div>
              <h3 className='text-sm font-medium text-gray-600'>{experience.role}</h3>
              <p className='text-xs text-gray-500'>{experience.period}</p>
            </div>
          </div>
        ))}
        <div className=''></div>
      </div>
    </section>
    
      <section id='4' className='flex flex-col items-center justify-center w-full h-screen bg-white md:bg-[#f4f9fc]' style={{ 'scrollSnapAlign': 'start' }}>
        <div className='p-8 bg-white sm:rounded-lg sm:shadow-2xl md:mx-48 lg:mx-72 2xl:mx-96'>
          <h1 className='2xl:text-xl mb-4 text-md font-semibold text-[#0f1b61]'>I am open to exciting job opportunities both in India and abroad, and I am eager to bring my skills and experience to new and challenging environments.
            <br /><br />Feel free to connect with me. I will get back to you as soon as possible.😉</h1>
          <form ref={formRef} onSubmit={sendEmail}>
            <div className="flex flex-col gap-3 pb-6 border-b text:sm 2xl:text-md border-gray-900/10">
              <div className="sm:col-span-4">
                <label htmlFor="username" className="block font-medium leading-6 text-gray-900">Name {errors.name && <span className="text-red-500">({errors.name})</span>}</label>
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input type="text" name="user_name" id="name" className="2xl:text-md block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:leading-6" placeholder="Enter your name*" />
                </div>
              </div>
              <div className="sm:col-span-4">
                <label htmlFor="username" className="block font-medium leading-6 text-gray-900">Email {errors.email && <span className="text-red-500">({errors.email})</span>}</label>
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input type="text" name="user_email" id="email" className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:leading-6" placeholder="Enter your email*" />
                </div>
              </div>
              <div className="col-span-full">
                <label htmlFor="about" className="block font-medium leading-6 text-gray-900">Message {errors.message && <span className="text-red-500">({errors.message})</span>}</label>
                <textarea id="message" name="message" rows="3" className="w-full block rounded-md border-0 py-1.5 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
                  placeholder='Write a message*'></textarea>
              </div>
            </div>
            <div className="flex items-center justify-end mt-6 gap-x-6">
              <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={event => { formRef.current.reset(); setErrors({}) }}>Clear</button>
              <button type="submit" value="Submit" className="px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Send</button>
              <ToastContainer
                position="bottom-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored" />
            </div>
          </form>
        </div>
      </section>
      <div className='h-20 bg-[#0f1b61] flex relative justify-center' style={{ 'scrollSnapAlign': 'start' }}>
        <p className='absolute font-semibold text-white bottom-6'>@ Copyright 2024, Made By <a className='underline' href='/'>Ambati Maneesha</a></p>
      </div>
    </main >
  );
}

export default App;
