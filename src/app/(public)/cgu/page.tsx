import type { Metadata } from "next";
import { LegalDocument, LegalSection } from "@/shared/legal/legal-document";
import { SITE_LEGAL } from "@/shared/legal/site-legal";

export const metadata: Metadata = {
  title: "Conditions Générales d’Utilisation — Text Corrector",
  description:
    "CGU de Text Corrector : abonnements, responsabilités et règles d’usage du service.",
};

export default function CguPage() {
  return (
    <LegalDocument title="Conditions Générales d’Utilisation">
      <LegalSection title="1. Objet et acceptation">
        <p>
          Les présentes Conditions Générales d’Utilisation (« <strong>CGU</strong> »)
          régissent l’accès et l’utilisation du service{" "}
          <strong>{SITE_LEGAL.brandName}</strong> accessible sur{" "}
          {SITE_LEGAL.siteUrl} (le « <strong>Service</strong> »), édité par{" "}
          {SITE_LEGAL.publisher.legalName} (l’« <strong>Éditeur</strong> »).
        </p>
        <p>
          Toute inscription, essai, utilisation du playground ou souscription
          d’un abonnement vaut acceptation pleine et entière des présentes
          CGU, des{" "}
          <a
            className="text-ds-ink underline underline-offset-2"
            href="/mentions-legales"
          >
            Mentions légales
          </a>{" "}
          et de la{" "}
          <a
            className="text-ds-ink underline underline-offset-2"
            href="/confidentialite"
          >
            Politique de confidentialité
          </a>
          . Si vous n’acceptez pas ces conditions, vous ne devez pas utiliser
          le Service.
        </p>
      </LegalSection>

      <LegalSection title="2. Description du Service">
        <p>
          {SITE_LEGAL.brandName} fournit des outils logiciels d’
          <strong>aide automatisée</strong> à la correction et à
          l’amélioration de textes (orthographe, grammaire, style et
          fonctionnalités associées). Le Service peut inclure un essai
          limité, un espace connecté, des statistiques, un classeur et des
          formules d’abonnement.
        </p>
        <p>
          Le Service est fourni « en l’état ». Les suggestions de correction
          sont générées de manière automatisée et peuvent être incomplètes,
          inexactes ou inadaptées au contexte.{" "}
          <strong>
            Vous êtes seul responsable de la relecture et de la validation
            finale de tout texte avant usage, publication ou envoi.
          </strong>
        </p>
      </LegalSection>

      <LegalSection title="3. Compte utilisateur">
        <p>
          Certaines fonctionnalités nécessitent un compte. Vous vous engagez
          à fournir des informations exactes, à préserver la confidentialité
          de vos identifiants et à nous informer sans délai de tout usage non
          autorisé. Toute action réalisée via votre compte est réputée
          effectuée par vous.
        </p>
      </LegalSection>

      <LegalSection title="4. Essai gratuit et crédits">
        <p>
          L’Éditeur peut proposer un volume limité de corrections gratuites
          (crédits d’essai), éventuellement conditionné à la fourniture d’un
          e-mail. Les crédits d’essai n’ont aucune valeur monétaire, ne sont
          ni cessibles ni remboursables, et peuvent être modifiés ou retirés
          à tout moment.
        </p>
      </LegalSection>

      <LegalSection title="5. Abonnements et paiements">
        <p>
          Des formules d’abonnement payantes peuvent être proposées
          (mensuelles, annuelles ou autres). Les prix, durée, contenu et
          conditions commerciales sont indiqués au moment de la souscription.
        </p>
        <ul>
          <li>
            Le paiement est traité par un prestataire de paiement tiers ;
            l’Éditeur ne conserve pas les données complètes de carte bancaire.
          </li>
          <li>
            Sauf mention contraire, l’abonnement se renouvelle
            automatiquement pour une période équivalente jusqu’à résiliation
            selon les modalités indiquées lors de la souscription.
          </li>
          <li>
            Pour les consommateurs situés dans l’UE/EEE : droit de
            rétractation de 14 jours, sauf demande expresse de commencer
            immédiatement la prestation numérique et renonciation à ce droit
            dans les conditions légales.
          </li>
          <li>
            En cas de défaut de paiement, l’Éditeur peut suspendre ou
            résilier l’accès aux fonctionnalités payantes.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Licence d’utilisation">
        <p>
          L’Éditeur vous concède une licence personnelle, non exclusive, non
          transférable et révocable d’utiliser le Service conformément aux
          CGU, pour la durée de votre accès (essai ou abonnement).
        </p>
        <p>
          Il est interdit de : copier, modifier, décompiler, extraire le code
          source (sauf exceptions légales), revendre le Service, automatiser
          massivement les appels (scraping, bots abusifs), contourner les
          limites de crédits / rate-limits, ou utiliser le Service pour créer
          un produit concurrent substantiellement similaire.
        </p>
      </LegalSection>

      <LegalSection title="7. Contenus utilisateurs — responsabilité exclusive">
        <p>
          Vous êtes <strong>seul et entier responsable</strong> des textes,
          fichiers et informations que vous saisissez, importez, stockez,
          corrigez, exportez ou diffusez via le Service («{" "}
          <strong>Contenus Utilisateur</strong> »).
        </p>
        <p>Vous garantissez notamment que vos Contenus Utilisateur :</p>
        <ul>
          <li>
            ne portent pas atteinte aux droits de tiers (propriété
            intellectuelle, image, vie privée, secret des affaires, etc.) ;
          </li>
          <li>
            ne sont pas illicites, diffamatoires, injurieux, discriminatoires,
            pornographiques illégaux, violents, trompeurs, ou contraires à
            l’ordre public ;
          </li>
          <li>
            ne contiennent pas de virus, malware ou code malveillant ;
          </li>
          <li>
            ne servent pas à des activités frauduleuses, de phishing, de
            spam, d’usurpation d’identité ou de contournement de la loi.
          </li>
        </ul>
        <p>
          <strong>
            L’Éditeur n’exerce aucun contrôle éditorial a priori sur les
            Contenus Utilisateur et ne saurait être tenu responsable de leur
            nature, exactitude, licéité ou usage.
          </strong>{" "}
          Vous assumez toutes les conséquences — y compris réclamations de
          tiers — liées à vos Contenus Utilisateur et à l’usage que vous
          faites des suggestions du Service.
        </p>
        <p>
          Vous accordez à l’Éditeur une licence mondiale, non exclusive,
          gratuite, uniquement pour héberger, traiter, transmettre et
          afficher vos Contenus Utilisateur dans la stricte mesure nécessaire
          au fonctionnement technique du Service.
        </p>
      </LegalSection>

      <LegalSection title="8. Absence de conseil professionnel">
        <p>
          Le Service n’est <strong>ni un conseil juridique, médical,
          financier, scolaire ni professionnel</strong>. Les sorties du
          correcteur ne constituent pas une validation officielle d’un texte
          (examen, contrat, publication réglementée, etc.). Vous devez faire
          valider tout contenu critique par une personne qualifiée.
        </p>
      </LegalSection>

      <LegalSection title="9. Disponibilité et modifications">
        <p>
          L’Éditeur peut modifier, suspendre ou interrompre tout ou partie du
          Service (maintenance, évolution, force majeure, sécurité). Aucune
          disponibilité permanente n’est garantie. Les fonctionnalités
          d’essai ou gratuites peuvent évoluer ou disparaître.
        </p>
      </LegalSection>

      <LegalSection title="10. Suspension et résiliation">
        <p>
          L’Éditeur peut suspendre ou résilier votre accès, sans préjudice de
          ses autres droits, en cas de manquement aux CGU, d’usage abusif, de
          risque pour la sécurité, de non-paiement, ou sur demande d’une
          autorité compétente. Vous pouvez cesser d’utiliser le Service et,
          le cas échéant, résilier votre abonnement selon les modalités
          indiquées lors de la souscription.
        </p>
      </LegalSection>

      <LegalSection title="11. Limitation de responsabilité">
        <p>Dans les limites autorisées par la loi :</p>
        <ul>
          <li>
            le Service est fourni sans garantie de résultat, d’exhaustivité
            ou d’adéquation à un usage particulier ;
          </li>
          <li>
            l’Éditeur n’est pas responsable des dommages indirects (perte de
            chance, perte de données, préjudice commercial, atteinte à
            l’image, etc.) ;
          </li>
          <li>
            l’Éditeur n’est pas responsable des Contenus Utilisateur ni des
            décisions prises sur la base des suggestions automatiques ;
          </li>
          <li>
            la responsabilité totale de l’Éditeur, toutes causes confondues,
            est limitée, sur les douze (12) derniers mois, au montant
            effectivement payé par vous au titre de l’abonnement (ou à zéro
            pour un usage exclusivement gratuit).
          </li>
        </ul>
        <p>
          Rien dans les CGU n’exclut la responsabilité qui ne peut être
          limitée en vertu du droit applicable (notamment dol, faute lourde,
          ou droits impératifs du consommateur).
        </p>
      </LegalSection>

      <LegalSection title="12. Indemnisation">
        <p>
          Vous vous engagez à indemniser et garantir l’Éditeur contre toute
          réclamation, perte ou frais (y compris honoraires raisonnables)
          découlant de vos Contenus Utilisateur, de votre usage du Service ou
          de votre violation des présentes CGU ou de la loi.
        </p>
      </LegalSection>

      <LegalSection title="13. Données personnelles">
        <p>
          Le traitement des données personnelles est décrit dans la{" "}
          <a
            className="text-ds-ink underline underline-offset-2"
            href="/confidentialite"
          >
            Politique de confidentialité
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="14. Droit applicable et litiges">
        <p>
          Les CGU sont régies par le droit français. En cas de litige, une
          solution amiable sera recherchée. À défaut, les tribunaux français
          compétents seront saisis, sous réserve des règles impératives de
          protection du consommateur (y compris médiation de la
          consommation lorsque applicable).
        </p>
      </LegalSection>

      <LegalSection title="15. Contact">
        <p>
          Pour toute question relative aux CGU :{" "}
          <a
            className="text-ds-ink underline underline-offset-2"
            href={`mailto:${SITE_LEGAL.publisher.contactEmail}`}
          >
            {SITE_LEGAL.publisher.contactEmail}
          </a>
          .
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
