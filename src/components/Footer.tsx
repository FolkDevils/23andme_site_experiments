'use client';

interface FooterProps {
  className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`w-full bg-white ${className}`}>
      <div className="max-w-[1440px] mx-auto px-8 lg:px-10 py-16">
        <div className="flex flex-row items-center justify-center">
          <div className="w-full max-w-[1130px]">
            <div className="font-rialta text-text-secondary text-disclaimer-text">
              <p className="mb-4">
                <span>
                  * The 23andMe PGS test includes health predisposition and carrier status reports. Health predisposition reports include both reports that meet FDA requirements for genetic health risks and reports which are based on 23andMe research and have not been reviewed by the FDA. The test uses qualitative genotyping to detect select clinically relevant variants in the genomic DNA of adults from saliva for the purpose of reporting and interpreting genetic health risks and reporting carrier status. It is not intended to diagnose any disease. Your ethnicity may affect the relevance of each report and how your genetic health risk results are interpreted. Each genetic health risk report describes if a person has variants associated with a higher risk of developing a disease, but does not describe a person&apos;s overall risk of developing the disease. The test is not intended to tell you anything about your current state of health, or to be used to make medical decisions, including whether or not you should take a medication, how much of a medication you should take, or determine any treatment. Our carrier status reports can be used to determine carrier status, but cannot determine if you have two copies of any genetic variant. These carrier reports are not intended to tell you anything about your risk for developing a disease in the future, the health of your fetus, or your newborn child&apos;s risk of developing a particular disease later in life. For certain conditions, we provide a single report that includes information on both carrier status and genetic health risk. Warnings & Limitations: The 23andMe PGS Genetic Health Risk Report for BRCA1/BRCA2 (Selected Variants) is indicated for reporting of 44 variants in the BRCA1 and BRCA2 genes. The report describes if a person&apos;s genetic result is associated with an increased risk of developing breast cancer and ovarian cancer and may be associated with an increased risk for prostate cancer, pancreatic cancer, and potentially other cancers. The variants included in this report do not represent the majority of the BRCA1/BRCA2 variants in people of most ethnicities. This report does not include variants in other genes linked to hereditary cancers and the absence of variants included in this report does not rule out the presence of other genetic variants that may impact cancer risk. This report is for over-the-counter use by adults over the age of 18, and provides genetic information to inform discussions with a healthcare professional. The PGS test is not a substitute for visits to a healthcare professional for recommended screenings or appropriate follow-up. Results should be confirmed in a clinical setting before taking any medical action. For important information and limitations regarding each genetic health risk and carrier status report, visit{' '}
                </span>
                <a
                  href="https://23andme.com/test-info/"
                  className="text-text-secondary hover:underline"
                >
                  23andme.com/test-info/
                </a>
                <span>
                  . 23andMe PGS Pharmacogenetics reports: The 23andMe test uses qualitative genotyping to detect 3 variants in the CYP2C19 gene, 2 variants in the DPYD gene and 1 variant in the SLCO1B1 gene in the genomic DNA of adults from saliva for the purpose of reporting and interpreting information about the processing of certain therapeutics to inform discussions with a healthcare professional. It does not describe if a person will or will not respond to a particular therapeutic. Our CYP2C19 Pharmacogenetics report provides certain information about variants associated with metabolism of some therapeutics and provides interpretive drug information regarding the potential effect of citalopram and clopidogrel therapy. Our SLCO1B1 Pharmacogenetics report provides certain information about variants associated with the processing of some therapeutics and provides interpretive drug information regarding the potential effect of simvastatin therapy. Our DPYD Pharmacogenetics report does not describe the association between detected variants and any specific therapeutic. Results for DPYD and certain CYP2C19 results should be confirmed by an independent genetic test prescribed by your own healthcare provider before taking any medical action. Warning: Test information should not be used to start, stop, or change any course of treatment and does not test for all possible variants that may affect metabolism or protein function. The PGS test is not a substitute for visits to a healthcare professional. Making changes to your current regimen can lead to harmful side effects or reduced intended benefits of your medication, therefore consult with your healthcare professional before taking any medical action. For important information and limitations regarding Pharmacogenetic reports, visit{' '}
                </span>
                <a
                  href="https://23andme.com/test-info/pharmacogenetics/"
                  className="text-text-secondary hover:underline"
                >
                  23andme.com/test-info/pharmacogenetics/
                </a>
              </p>
              
              <p className="mb-4">
                ‡ Our genotyping product detects 250 health-related variants in our Carrier Status and Genetic Health Risk reports. The Exome Sequencing reports detect 50,000+ hereditary disease-causing variants.
              </p>
              
              <p className="mb-0">
                <span>
                  1 Enhancing the Clinical Value of Medical Laboratory Testing Link:{' '}
                </span>
                <a
                  href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5759162/"
                  className="text-text-secondary hover:underline"
                >
                  https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5759162/
                </a>
                <span>
                  {' '}Source: National Library of Medicine
                </span>
                <br />
                <br />
                <span>
                  Δ Exome Sequencing and blood testing services are available to eligible customers upon completion of the intake questionnaire that must be reviewed, approved and ordered by a third-party clinician. Exome Sequencing is analyzed by a CLIA- and CAP-accredited laboratory. Blood testing is completed by Quest Diagnostics. All telehealth services are provided in accordance with the{' '}
                </span>
                <a
                  href="https://www.23andme.com/legal/telehealth-tos/"
                  className="text-text-secondary hover:underline"
                >
                  Telehealth Terms
                </a>
                <span> and </span>
                <a
                  href="https://www.23andme.com/legal/telehealth-consent/"
                  className="text-text-secondary hover:underline"
                >
                  Consent to Telehealth
                </a>
                <span>.
                </span>
                <br />
                <br />
                <span>
                  ⬥ Check with your FSA/HSA administrator or tax professional for confirmation on the specific requirements for individual eligibility and reimbursement, including usage, procedures and qualifications.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 