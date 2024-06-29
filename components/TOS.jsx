const TOS = ({setAcceptedTos,Cookies,alert}) => {

    const accept = async () => {
        Cookies.set('tosAccepted', 'true', { expires: 365 });
        setAcceptedTos(true)
    }

    const decline = async () => {
        alert("error","Do you accept the terms?")
    }

    return(
        <div className={"tos"}>
        <div className={"tosCont"}>
            <div className={"tosHeader"}>Terms of service</div>
            <div className={"tosContent"}>
            <div className={"tosTitle"}>1. Acceptance of Terms</div>
            <div className={"tosAgree"}>By accessing or using the decentralized 50/50 raffle Application 50-50.IO, you agree to be bound by these terms and conditions. 
            If you do not agree with all of these Terms, do not use the Application.</div>

            <div className={"tosTitle"}>2. Description of Service</div>
            <div className={"tosAgree"}>The Application provides a blockchain-based platform that allows users to organize and participate in 50/50 raffle events. 
            The Application is decentralized and operates autonomously on the Base l2 (layer-2) without any central authority or oversight.</div>

            <div className={"tosTitle"}>3. Legal Compliance</div>
            <div className={"tosAgree"}>You acknowledge that the operation of raffles and lotteries is regulated in many jurisdictions and that you are solely responsible for ensuring that your use of the Application complies with all applicable laws and regulations. 
            You represent and warrant that you are either a non-profit organization or have obtained all necessary licenses and approvals to conduct a raffle or lottery in your jurisdiction.</div>

            <div className={"tosTitle"}>4. No Liability for Misuse</div>
            <div className={"tosAgree"}>The developer of the Application KingSimpa69 does not oversee, monitor, or control the activities conducted through the application and shall not be liable for any illegal, unauthorized, or improper use of the Application. 
            You agree to indemnify and hold the Developer harmless from any claims, damages, or expenses arising from your use of the Application.</div>

            <div className={"tosTitle"}>5. No Warranty</div>
            <div className={"tosAgree"}>The Application is provided &#34;as is&#34; and &#34;as available,&#34; without any warranty of any kind, either express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, or non-infringement. 
            The Developer does not warrant that the Application will be uninterrupted, secure, or free from errors.</div>

            <div className={"tosTitle"}>6. Limitation of Liability</div>
            <div className={"tosAgree"}>In no event will the Developer be liable for any direct, indirect, punitive, incidental, special, or consequential damages arising out of or in any way connected with your use of the Application, whether based on contract, tort, strict liability, or any other legal theory.</div>

            <div className={"tosTitle"}>7. Modification of Terms</div>
            <div className={"tosAgree"}>The Developer reserves the right, at its discretion, to modify these Terms at any time. 
            Your continued use of the Application following the posting of changes to these Terms will mean you accept those changes.</div>

            <div className={"tosTitle"}>8. Governing Law</div>
            <div className={"tosAgree"}>These Terms shall be governed by and construed in accordance with the laws of the users local jurisdiction, without giving effect to any principles of conflicts of law.</div>

            <div className={"tosTitle"}>9. Dispute Resolution</div>
            <div className={"tosAgree"}>Any disputes arising out of or related to these Terms or the use of the Application shall be resolved through binding arbitration in accordance with the rules of the International Chamber of Commerce.</div>
            </div>

            <div className={"tosActions"}>
                <div onClick={()=>decline()} className={"tosDecline"}>Decline</div>
                <div onClick={()=>accept()} className={"tosAccept"}>Accept</div>
            </div>
        </div>
        </div>
    )
}

export default TOS