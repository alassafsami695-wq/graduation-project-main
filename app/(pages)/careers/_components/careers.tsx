import { getCareers } from "@/actions/careers/get-careers";

export default async function AdminJobsPage() {
    const jobs = await getCareers();

    return (
        <div>
            {jobs.data.map((job: any) => (
                <div key={job.id}>
                    <h3>{job.title}</h3>
                    <p>{job.description}</p>
                </div>
            ))}
        </div>
    );
}
