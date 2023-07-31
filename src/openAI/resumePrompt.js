export const resumePrompt = {
  initalPrompt: `
  Please help me extract the following fields from each CV and use the followings as the keys:
  `,
  bioPrompt: `
  profile (string): return the about me section about the candidate from the resume else summarize into a readable paragraph.
  name (string): The name of the candidate. Letter of each word is capital, the rest are lowercase.
  firstName (string): The first name of the candidate. Letter of each word is capital, the rest are lowercase.
  lastName (string): The last name of the candidate. Letter of each word is capital, the rest are lowercase.s
  gender (string): The gender of the candidate, return either "male" or "female". If not present, try to guess from the name.
  spokenLanguages (array): All the languages that the candidate speaks. If not present, return the language used to write this resume.
  email (string): The email address of the candidate.
  mobile (string): The mobile number of the candidate.
  currentLocation (string): return the candidate's current country he/she resides in. If not available, just use the location of the candidate latest employment.s
  nationality (string): Return the nationality based on the country the candidate is born in. If not present, get the nationality from the currentLocation.
  `,
  skillsPrompt: `
  skills (array): The skills possessed by the candidate. All skills. If there is no skills section, get skills from other resume content. Must return some skills.
  primarySkills (array): From skills array, select the primary skills frequently appearing throughout the resume. Just technical skills and software skills, no linguistic languages. If empty, return skills array.
  secondarySkills (array):  From skills array, select the secondary skills that doesn't show up in the primary skills.
  `,
  companiesPrompt: `
  companiesDetails (array): return every companies the candidate worked with including internships. Sort the array from the most recent to earliest in terms of endDate.
  1)	name:(string) name of the company . If nothing, return "".
  2)	startDate: (string, format="mm/yyyy") convert start date of employment to this format "04/2023" E.g 04/2023, if nothing, just use end date of previous job. If only year present, then return month to be jan.
  3)	endDate: (string, format="mm/yyyy") end date. Convert format to output "03/2023" E.g 04/2023. If no end date and is the candidate last job, just use 07/2023, present/Present == 07/2023. If only year present, then return month to be jan.
  4) noOfYears: (decimal) Number of education years in the institution. Else return 0.0. If start date is empty, then is 0. If there is only start date, then take take it as 1 year.
  4)	noOfYears: (decimal) Number of employment years in the company. Else return 0.0. If start date is empty, then is 0. If there is only start date, then take it as 1 year.
  5) jobTitle: The candidate's job title for this job.
  6) responsibilities: (array) The candidate's responsibilities for this job. Get from resume. Do not paraphrase.
  yearsOfExperience (number): Total employment in years including internship based on the information in companiesDetails (array). Convert all the months to years. Return only the total value only, but if there are overlapping months, do not double count.
  `,
  educationPrompt: `
  educationDetails (array): return all the education, institution and qualification.
  1) name:(string) name of the institution . If nothing, return "".
  2) startDate: (string, format="mm/yyyy") start date education typically in the format "month/year" E.g 04/2023. If only year present, then return month to be jan.
  3) endDate: (string, format="mm/yyyy") end date. Use this format for output "month/year" E.g 04/2023. If no end date, just use 06/2023, present == 06/2023. If only year present, then return month to be jan.
  4) noOfYears: (decimal) Number of education years in the institution. Else return 0.0. If start date is empty, then is 0. If there is only start date, then take take it as 1 year.
  5) qualification: The qualification of the education.
  education (string): Give me the candidate highest education qualification in the resume.
  jobTitle (string): return the candidate's job title of his/her latest job in the companiesDetail.
  `,
  endPrompt:`
  Please return only the JSON format. Please do not return any other strings. Ensure that the JSON format is valid and complete according to the above requirements.The following is a chunk of a CV.
  Complete the response before returning the response. For any empty results, reparse the resume again and get a result.
  `
}

// yearsOfExperience (number): Total employment in years including internship based on the information in companiesDetails (array). Convert all the months to years. Return only the total value only, but if there are overlapping months, do not double count. Verify by adding up all the noOfYears from companiesDetails array.
