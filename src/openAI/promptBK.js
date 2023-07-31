const prompt = `
  Please help me extract the following fields from each CV and use the followings as the keys:
  name (string): The name of the candidate. Letter of each word is capital, the rest are lowercase.
  firstName (string): The first name of the candidate. Letter of each word is capital, the rest are lowercase.
  lastName (string): The last name of the candidate. Letter of each word is capital, the rest are lowercase.s
  gender (string): The gender of the candidate, return either "male" or "female". If not present, try to guess from the name.
  spokenLanguages (array): All the languages that the candidate speaks. If not present, return the language used to write this resume.
  email (string): The email address of the candidate.
  mobile (string): The mobile number of the candidate.
  skills (array): The skills possessed by the candidate. All skills. If cannot find, infer his skills from resume content.
  primarySkills (array): From skills array, select the primary skills frequently appearing throughout the resume. Just technical skills and software skills, no linguistic languages. If empty, return skills array.
  secondarySkills (array):  From skills array, select the secondary skills that doesn't show up in the primary skills.
  currentLocation (string): return the candidate's current country he/she resides in. If not available, just use the location of the candidate latest employment.s
  nationality (string): Return the nationality based on the country the candidate is born in. If not present, get the nationality from the currentLocation.
  companiesDetails (array): return every companies the candidate worked with including internships. Sort the array from the most recent to least recent in terms of endDate.
  1)	name:(string) name of the company . If nothing, return "".
  2)	startDate: (string) convert start date of employment to this format "04/2023" E.g 04/2023, if nothing, just use end date of previous job. If only year present, then return month to be jan.
  3)	endDate: (string) end date. Convert format to output "03/2023" E.g 04/2023. If no end date, just use 06/2023, present == 06/2023. If only year present, then return month to be jan.
  4)	noOfYears: (decimal) Number of employment years in the company. Else return 0.0. If start date is empty, then is 0. If there is only start date, then take it as 1 year.
  5) jobTitle: The candidate's job title for this job.
  6) responsibilities: (array) The candidate's responsibilities for this job. Get from resume. Do not paraphrase.
  yearsOfExperience (number): Total employment in years including internship based on the information in companiesDetails (array). Convert all the months to years. Return only the total value only, but if there are overlapping months, do not double count. Verify by adding up all the noOfYears from companiesDetails array.
  1)Exclude education and trainings.
  2) If candidate mention only present date without start date, then calculate years based on the last working date to present.
  3) If candidate mention start date to present date, then calculate years based on the start date to present date.
  4) Present year is 2023.
  5) Employment dates for each position mentioned in your career history. Include the month and year for both the start and end dates of each job.
  If any positions have unspecified employment dates, please mention that explicitly. Based on these, calculate the number of employment years of the candidate.
  6) Please return number of years. Not months.
  7) Always use candidate stated start date to end date first.
  8) present always refer to end date.
  companies (array): The names of the recent 3 companies the candidate has worked for. Do not return duplicate companies.
  education (string): Give me the candidate highest education qualification in the resume.
  jobTitle (string): return the candidate's job title of his/her latest job in the companiesDetail.
  profile (string): return the about me section about the candidate from the resume else summarize into a readable paragraph.
  educationDetails (array): return all the education, institution and qualification. Sort the array from the most recent to least recent in terms of endDate.
  1)	name:(string) name of the institution . If nothing, return "".
  2)	startDate: (string) start date education typically in the format "month/year" E.g 04/2023. If only year present, then return month to be jan.
  3)	endDate: (string) end date. Use this format for output "month/year" E.g 04/2023. If no end date, just use 06/2023, present == 06/2023. If only year present, then return month to be jan.
  4)	noOfYears: (decimal) Number of education years in the institution. Else return 0.0. If start date is empty, then is 0. If there is only start date, then take take it as 1 year.
  5) qualification: The qualification of the education.
  Please return only the JSON format. Please do not return any other strings. Ensure that the JSON format is valid and complete according to the above requirements.The following is a chunk of a CV.
  Complete the response before returning the response. For any empty results, reparse the resume again and get a result.
  `;
