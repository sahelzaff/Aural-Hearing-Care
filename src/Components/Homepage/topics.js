import assets from '../../../public/assets/assets';

const topics = [
    {
        id: 1,
        logo: <img src={assets.hearing_test} alt="hearing test" className="w-12 h-12 object-contain" />,
        name: 'Hearing Test',
        content: (
            <div className="flex flex-row gap-10 items-center">
                <img src={assets.hearing_test_1} alt="React" className="w-2/4 h-auto object-cover mr-4 rounded-lg" />
                <div className="w-2/4 mt-5 ">
                    <h2 className="text-xl font-bold mb-2 font-outfit">Pure Tone Audiometry:</h2>
                    <p className="mb-4 font-poppins text-sm">This test measures your ability to hear different tones at various frequencies and volumes. You will be asked to wear headphones and press a button each time you hear a sound. The results are plotted on an audiogram, which shows your hearing sensitivity across a range of frequencies.</p>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Speech Audiometry:
                    </h2>
                    <p className="mb-4 font-poppins text-sm">This test evaluates how well you can hear and understand speech at different volumes. The audiologist will ask you to repeat words or sentences presented through headphones or speakers, which helps assess your ability to process speech sounds.
                    </p>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Tympanometry:
                    </h2>
                    <p className="mb-4 font-poppins text-sm">This test evaluates the function of your middle ear and eardrum. A probe is placed in your ear canal, and variations in air pressure are used to assess how well the eardrum responds. Tympanometry can help detect fluid in the middle ear, eardrum perforations, or issues with the ossicles (tiny bones in the middle ear).

                    </p>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Acoustic Reflex Test:
                    </h2>
                    <p className="mb-4 font-poppins text-sm">This test measures the reflexive response of your middle ear muscles to loud sounds. It helps identify issues with the auditory nerve and the pathway that connects the ear to the brain.
                    </p>
                </div>


            </div>
        )
    },
    {
        id: 2,
        logo: <img src={assets.tinnitus} alt="hearing test" className="w-12 h-12 object-contain" />,
        name: 'Tinnitus evaluation',
        content: (
            <div className="flex flex-row gap-10 items-start mt-10">
                <img src={assets.play_card_2} alt="React" className="w-2/4 h-auto object-cover mr-4 rounded-lg" />
                <div className="w-2/4 mt-5 ">

                    <p className="mb-4 font-poppins text-sm">Tinnitus evaluation is a specialized process designed to assess and understand the nature of tinnitus, which is the perception of ringing, buzzing, or other noises in the ears when no external sound is present. The evaluation typically includes the following steps:
                    </p>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Hearing Test:
                    </h2>
                    <p className="mb-4 font-poppins text-sm">Since tinnitus often goes hand in hand with hearing loss, a hearing test will usually be done. This test checks your ability to hear various sounds and helps us see if there's any hearing loss that might be linked to your tinnitus.
                    </p>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Tinnitus Pitch Matching:
                    </h2>
                    <p className="mb-4 font-poppins text-sm">We’ll work with you to identify the specific sound you’re hearing. By playing different tones, we can help you match the pitch and loudness of your tinnitus. This step is crucial for understanding what you’re experiencing and how it can be managed.
                    </p>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Finding Relief with Masking:
                    </h2>
                    <p className="mb-4 font-poppins text-sm">Another part of the evaluation might involve playing various external sounds to see which ones can help mask or reduce the tinnitus. This can guide potential treatments like sound therapy.
                    </p>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Middle Ear Check:
                    </h2>
                    <p className="mb-4 font-poppins text-sm">We might also conduct a test to examine the function of your middle ear. This involves checking for any issues like fluid buildup or eardrum problems that could be contributing to your tinnitus.
                    </p>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Understanding Your Daily Life Impact:
                    </h2>
                    <p className="mb-4 font-poppins text-sm">You may be asked to complete some questionnaires that help us understand how tinnitus is affecting your daily life, including your sleep, concentration, and mood. This information is vital for tailoring the right treatment approach for you. </p>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Reviewing the Results:
                    </h2>
                    <p className="mb-4 font-poppins text-sm">Once all the tests are completed, we’ll go over the results with you, explaining what we’ve found. We’ll discuss possible causes of your tinnitus and talk about treatment options that might help, such as sound therapy, hearing aids, or further medical advice.
                    </p>
                </div>


            </div>
        )
    },
    {
        id: 3,
        logo: <img src={assets.tinnitus} alt="hearing test" className="w-12 h-12 object-contain" />,
        name: 'Speech Therapy',
        content: (
            <div className="flex flex-row gap-10 items-start mt-10">
                <img src={assets.play_card_3} alt="React" className="w-2/4 h-auto object-cover mr-4 rounded-lg" />
                <div className="w-2/4 mt-5 ">

                    <p className="mb-4 font-poppins text-sm">Speech therapy is a specialized service designed to help individuals improve their speech, language, communication, and swallowing abilities. It's particularly beneficial for people with speech disorders, language delays, voice disorders, or difficulties with social communication or cognitive communication Disorder.
                    </p>
                    <h2 className="text-xl font-bold mb-2 font-outfit">How Speech Therapy Works:
                    </h2>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Assessment:
                    </h2>
                    <p className="mb-4 font-poppins text-sm">The process begins with an assessment to identify the specific speech or language issues. This may involve standardized tests, observations, and discussions with the patient and family.
                    </p>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Personalized Treatment Plan:
                    </h2>
                    <p className="mb-4 font-poppins text-sm">Based on the assessment, a customized treatment plan is created. This plan outlines specific goals and the steps needed to achieve them. Therapy sessions may involve exercises, activities, and practice in real-life scenarios.
                    </p>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Regular Sessions:
                    </h2>
                    <p className="mb-4 font-poppins text-sm">Speech therapy typically involves regular sessions, which can be one-on-one or in small groups, depending on the needs of the individual. The frequency and duration of therapy vary based on the severity of the issues being addressed.
                    </p>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Home Practice:
                    </h2>
                    <p className="mb-4 font-poppins text-sm">WTo reinforce progress, therapists often provide exercises and activities to be done at home. This helps maintain continuity and accelerates improvement.
                    </p>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Progress Monitoring:
                    </h2>
                    <p className="mb-4 font-poppins text-sm">Throughout the therapy, the speech therapist will monitor progress, make adjustments to the treatment plan as needed, and provide feedback to the patient and their family.
                    </p>

                </div>


            </div>
        )
    },
    {
        id: 4,
        logo: <img src={assets.tinnitus} alt="hearing test" className="w-12 h-12 object-contain" />,
        name: 'Newborn hearing screening',
        content: (
            <div className="flex flex-row gap-10 items-start mt-10">
                <img src={assets.play_card_4} alt="React" className="w-2/4 h-auto object-cover mr-4 rounded-lg" />
                <div className="w-2/4 mt-5 ">

                    <p className="mb-4 font-poppins text-sm">Newborn hearing screening is a quick and simple test that helps detect hearing loss in newborn babies. This screening is crucial because early detection of hearing issues can significantly impact a child’s development, especially in terms of speech and language skills. Here’s what you need to know about newborn hearing screening:
                    </p>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Why It’s Important:
                    </h2>
                    
                    <h2 className="text-lg font-bold mb-2 font-outfit">Early Detection: <span className=' font-poppins text-sm font-normal mb-0'>Identifying hearing loss early allows for timely intervention, which is vital for a child’s communication development.
                    </span></h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Improved Outcomes: <span className=' font-poppins text-sm font-normal mb-0'>Early treatment can help prevent delays in speech, language, and cognitive development, leading to better long-term outcomes.
                    </span></h2>
                    
                    <h2 className="text-xl font-bold mb-2 font-outfit">How the Screening Is Done:</h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Timing:<span className=' font-poppins text-sm font-normal mb-0'>The screening is usually done before the baby leaves the hospital, within the first few days of life. If the baby wasn’t born in a hospital, the screening should be done within the first month.
                    </span></h2>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Types of Tests:
                    </h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Otoacoustic Emissions (OAE):
                    <span className=' font-poppins text-sm font-normal mb-0'>A small earphone is placed in the baby’s ear, and gentle sounds are played. The test measures the echo produced by the inner ear (cochlea) in response to these sounds. If there’s no echo, it could indicate hearing loss.
                    </span></h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Auditory Brainstem Response (ABR)::
                    <span className=' font-poppins text-sm font-normal mb-0'>Small electrodes are placed on the baby’s head while soft sounds are played through earphones. The test measures how the hearing nerve and brain respond to sound. This test is often used if the baby didn’t pass the OAE or if there are other risk factors for hearing loss.
                    </span></h2>

                    <h2 className="text-lg font-bold mb-2 font-outfit">Quick and Painless:
                    <span className=' font-poppins text-sm font-normal mb-0'>The screening is non-invasive and painless. It usually takes just a few minutes and can be done while the baby is sleeping.
                    </span></h2>

                    <h2 className="text-xl font-bold mb-2 font-outfit">What Happens If a Baby Doesn’t Pass the Screening:</h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Follow-Up Testing:
                    <span className=' font-poppins text-sm font-normal mb-0'>If the baby doesn’t pass the initial screening, it doesn’t necessarily mean there is a hearing loss. It may be due to fluid in the ear, noise in the testing environment, or the baby being unsettled during the test. A follow-up test will be scheduled to confirm the results.
                    </span></h2>
                   
                    <h2 className="text-lg font-bold mb-2 font-outfit">Further Evaluation:
                    <span className=' font-poppins text-sm font-normal mb-0'>If the follow-up test still shows potential hearing loss, the baby will be referred to a pediatric audiologist for a comprehensive hearing evaluation.
                    </span></h2>

                    <h2 className="text-xl font-bold mb-2 font-outfit">What Parents Should Know:

                    </h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Normal Part of Newborn Care:
                    <span className=' font-poppins text-sm font-normal mb-0'>Newborn hearing screening is a routine part of newborn care in many places. It’s safe, reliable, and crucial for ensuring that any potential hearing issues are identified early.
                    </span></h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Early Intervention:
                    <span className=' font-poppins text-sm font-normal mb-0'>If hearing loss is confirmed, early intervention services can be started right away. These might include hearing aids, cochlear implants, speech therapy, or other communication strategies to help the child develop normal speech and language skills.
                    </span></h2>
                    <p className="mb-4 font-poppins text-sm">Newborn hearing screening is a simple but powerful tool in safeguarding your child’s ability to hear and communicate effectively as they grow.
                    </p>
                   
                    

                </div>


            </div>
        )
    },
    {
        id: 5,
        logo: <img src={assets.tinnitus} alt="hearing test" className="w-12 h-12 object-contain" />,
        name: 'Immittance audiometry',
        content: (
            <div className="flex flex-row gap-10 items-start mt-10">
                <img src={assets.play_card_5} alt="React" className="w-2/4 h-auto object-cover mr-4 rounded-lg" />
                <div className="w-2/4 mt-5 ">

                    <p className="mb-4 font-poppins text-sm">Immittance audiometry, also known as impedance audiometry, is a test used to check how well the middle ear is working. It focuses on understanding how sound travels through the ear and how the middle ear structures, like the eardrum and the tiny bones inside, are functioning.
                    </p>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Key Components:</h2>
                    
                    <h2 className="text-lg font-bold mb-2 font-outfit">Tympanometry:<span className=' font-poppins text-sm font-normal mb-0'> This measures how the eardrum moves when air pressure is changed in the ear canal. A small probe is placed in the ear, and as the pressure varies, the test records the movement of the eardrum. This can help identify issues like fluid in the middle ear or a perforated eardrum.
                    </span></h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Acoustic Reflex Testing:<span className=' font-poppins text-sm font-normal mb-0'> This part assesses how the middle ear muscles respond to loud sounds. When a loud noise is played, the muscles in the middle ear contract, which affects how sound is transmitted. This can help in diagnosing problems with the auditory nerve or brainstem.
                    </span></h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Static Compliance:<span className=' font-poppins text-sm font-normal mb-0'> This measures how flexible the eardrum and middle ear structures are. If the compliance is lower than normal, it might indicate problems like fluid in the middle ear.
                    </span></h2>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Importance:</h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Diagnosing Middle Ear Issues:<span className=' font-poppins text-sm font-normal mb-0'> It helps identify problems such as ear infections, perforated eardrums, or issues with the eustachian tube.
                    </span></h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Assessing Hearing Loss:<span className=' font-poppins text-sm font-normal mb-0'> It distinguishes between hearing loss caused by problems in the middle ear and loss due to inner ear or nerve issues.
                    </span></h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Monitoring Surgical Outcomes:<span className=' font-poppins text-sm font-normal mb-0'>  It’s useful for checking how well the middle ear is functioning before and after surgeries like ear tube placement or eardrum repair.
                    </span></h2>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Children:</h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Monitoring Surgical Outcomes:<span className=' font-poppins text-sm font-normal mb-0'>  It’s often used to diagnose and monitor hearing problems in kids, especially if they have frequent ear infections or developmental hearing issues.
                    </span></h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">People with Hearing Complaints:<span className=' font-poppins text-sm font-normal mb-0'>  If someone has symptoms like a feeling of fullness in the ear or fluid, this test can provide valuable information.
                    </span></h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Pre and Post-Surgical Patients:<span className=' font-poppins text-sm font-normal mb-0'>  It’s important for evaluating middle ear function before and after surgeries to ensure the procedures are effective.
                    </span></h2>
                   
                    

                </div>


            </div>
        )
    },
    {
        id: 6,
        logo: <img src={assets.tinnitus} alt="hearing test" className="w-12 h-12 object-contain" />,
        name: 'Cochlear Implant Program',
        content: (
            <div className="flex flex-row gap-10 items-start mt-10">
                <img src={assets.play_card_6} alt="React" className="w-2/4 h-auto object-cover mr-4 rounded-lg" />
                <div className="w-2/4 mt-5 ">

                    <p className="mb-4 font-poppins text-sm">A Cochlear Implant Program is a structured plan designed to provide individuals with severe to profound hearing loss access to cochlear implants and the support they need to use them effectively. This program typically includes several stages, from evaluation to long-term follow-up. Here’s a closer look at what such a program usually involves:
                    </p>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Key Components of a Cochlear Implant Program:</h2>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Assessment and Evaluation:</h2>
                    
                    <h2 className="text-lg font-bold mb-2 font-outfit">Hearing Assessment:<span className=' font-poppins text-sm font-normal mb-0'> Detailed audiological tests to determine the degree and type of hearing loss.
                    </span></h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Medical Evaluation:<span className=' font-poppins text-sm font-normal mb-0'> A thorough examination by an ear, nose, and throat (ENT) specialist to assess suitability for surgery and address any medical conditions that might affect implantation.
                    </span></h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Speech and Language Assessment:<span className=' font-poppins text-sm font-normal mb-0'> Evaluation by a speech-language pathologist to understand the individual's communication needs and potential for benefit from the implant.
                    </span></h2>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Counseling and Education:</h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Pre-Implantation Counseling:<span className=' font-poppins text-sm font-normal mb-0'> Providing information about what to expect from the cochlear implant, including potential benefits and limitations.
                    </span></h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Informed Consent:<span className=' font-poppins text-sm font-normal mb-0'>  Ensuring that the patient (or their guardian) understands the procedure, risks, and post-implantation expectations.
                    </span></h2>

                    <h2 className="text-xl font-bold mb-2 font-outfit">Surgical Procedure:</h2>

                    <h2 className="text-lg font-bold mb-2 font-outfit">Implant Surgery:<span className=' font-poppins text-sm font-normal mb-0'>  The procedure involves placing the internal components of the cochlear implant into the inner ear. This is usually done under general 
                    </span></h2>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Activation and Initial Fitting:</h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Device Activation:<span className=' font-poppins text-sm font-normal mb-0'>  After the implant heals, the external processor is turned on, and initial settings are adjusted.
                    </span></h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Mapping:<span className=' font-poppins text-sm font-normal mb-0'> The process of programming the cochlear implant’s settings to match the individual’s hearing needs. This is often done in several sessions to fine-tune the device.
                    </span></h2>
                   
                    <h2 className="text-xl font-bold mb-2 font-outfit">Rehabilitation and Support:</h2>
                    
                    <h2 className="text-lg font-bold mb-2 font-outfit">Auditory Training:<span className=' font-poppins text-sm font-normal mb-0'>  Ongoing sessions with an audiologist or auditory-verbal therapist to help the patient learn to interpret sounds and improve listening skills.
                    </span></h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Speech Therapy:<span className=' font-poppins text-sm font-normal mb-0'>   For those who need additional support with speech and language development.
                    </span></h2>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Long-Term Follow-Up:</h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Regular Check-ups:<span className=' font-poppins text-sm font-normal mb-0'> Routine visits to monitor the performance of the cochlear implant and adjust settings as needed.
                    </span></h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Support Groups:<span className=' font-poppins text-sm font-normal mb-0'> Participation in support groups for additional help and shared experiences with others who use cochlear implants.
                    </span></h2>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Importance of a Cochlear Implant Program:</h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Comprehensive Care:<span className=' font-poppins text-sm font-normal mb-0'> Ensures that individuals receive all necessary evaluations and support to maximize the benefits of the cochlear implant.
                    </span></h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Personalized Approach:<span className=' font-poppins text-sm font-normal mb-0'> Tailors the implantation process and follow-up care to the specific needs and capabilities of the individual.
                    </span></h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Maximizing Outcomes:<span className=' font-poppins text-sm font-normal mb-0'> Through structured rehabilitation and ongoing support, individuals can achieve the best possible hearing outcomes and improve their quality of life.
                    </span></h2>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Who Might Benefit:</h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Children with Severe Hearing Loss:<span className=' font-poppins text-sm font-normal mb-0'>  Children who do not benefit sufficiently from hearing aids and have severe to profound hearing loss.
                    </span></h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Adults with Severe to Profound Hearing Loss:<span className=' font-poppins text-sm font-normal mb-0'> Individuals who find that traditional hearing aids are not effective and who meet the criteria for cochlear implantation.
                    </span></h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">People Seeking Improved Communication:<span className=' font-poppins text-sm font-normal mb-0'> Those who want to improve their ability to communicate effectively in various settings.
                    </span></h2>

                    <p className="mb-4 font-poppins text-sm">A Cochlear Implant Program provides a comprehensive framework to help individuals with significant hearing loss gain the benefits of a cochlear implant and adapt to their new hearing capabilities.
                    </p>
                </div>


            </div>
        )
    },
    {
        id: 7,
        logo: <img src={assets.tinnitus} alt="hearing test" className="w-12 h-12 object-contain" />,
        name: 'Occupational Hearing Conservation',
        content: (
            <div className="flex flex-row gap-10 items-start mt-10">
                <img src={assets.play_card_6} alt="React" className="w-2/4 h-auto object-cover mr-4 rounded-lg" />
                <div className="w-2/4 mt-5 ">

                    <p className="mb-4 font-poppins text-sm">Occupational Hearing Conservation Programs (OHCPs) are comprehensive strategies designed to protect workers from hearing loss caused by exposure to loud noises in the workplace. These programs are essential for industries where employees are regularly exposed to high noise levels, such as manufacturing, construction, and mining.
                    </p>
                    <h2 className="text-xl font-bold mb-2 font-outfit">Importance of Occupational Hearing Conservation Programs:</h2>
                
                    <h2 className="text-lg font-bold mb-2 font-outfit">Prevention of Hearing Loss:<span className=' font-poppins text-sm font-normal mb-0'>Protects workers from developing hearing loss due to prolonged exposure to high noise levels.
                    </span></h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Regulatory Compliance:<span className=' font-poppins text-sm font-normal mb-0'> Helps organizations comply with regulations and standards set by agencies such as OSHA (Occupational Safety and Health Administration) and other local regulations.
                    </span></h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Enhanced Worker Safety:<span className=' font-poppins text-sm font-normal mb-0'> Promotes overall workplace safety by reducing the risk of noise-induced hearing damage, which can also contribute to overall job performance and satisfaction.
                    </span></h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Cost Savings:<span className=' font-poppins text-sm font-normal mb-0'> Reduces costs associated with hearing loss claims, worker compensation, and potential productivity losses.
                    </span></h2>
                    <h2 className="text-xl font-bold mb-2 font-outfit">For Whom It Is Required:</h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Industries with High Noise Levels:<span className=' font-poppins text-sm font-normal mb-0'> Workers in sectors such as manufacturing, construction, mining, transportation, and military are at higher risk and require such programs.
                    </span></h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Employees Exposed to Hazardous Noise:<span className=' font-poppins text-sm font-normal mb-0'> Individuals who work in environments where noise levels exceed established safety thresholds, typically 85 decibels (dB) over an 8-hour workday.
                    </span></h2>
                    <h2 className="text-lg font-bold mb-2 font-outfit">Employers:<span className=' font-poppins text-sm font-normal mb-0'> Companies have a legal and ethical obligation to implement OHCPs to protect their employees and comply with safety regulations.
                    </span></h2>

                    <p className="mb-4 font-poppins text-sm">Overall, Occupational Hearing Conservation Programs are crucial for safeguarding workers' hearing health and ensuring a safer and more productive work environment.
                    </p>
                </div>


            </div>
        )
    },

];

export default topics;
