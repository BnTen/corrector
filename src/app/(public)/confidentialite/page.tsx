import type { Metadata } from "next";
import { LegalDocument, LegalSection } from "@/shared/legal/legal-document";
import { SITE_LEGAL } from "@/shared/legal/site-legal";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Text Corrector",
  description:
    "Politique de confidentialité et protection des données personnelles (RGPD) de Text Corrector.",
};

export default function ConfidentialitePage() {
  const { publisher } = SITE_LEGAL;

  return (
    <LegalDocument title="Politique de confidentialité">
      <LegalSection title="1. Objet">
        <p>
          La présente politique décrit comment <strong>{SITE_LEGAL.brandName}</strong>{" "}
          (« nous ») collecte, utilise, conserve et protège les données
          personnelles des utilisateurs du site {SITE_LEGAL.siteUrl} et du
          service associé (essai gratuit, compte, abonnements).
        </p>
        <p>
          Nous traitons vos données conformément au Règlement (UE) 2016/679
          (RGPD) et à la loi Informatique et Libertés.
        </p>
      </LegalSection>

      <LegalSection title="2. Responsable de traitement">
        <p>
          Le responsable de traitement est l’éditeur du service :{" "}
          <strong>{publisher.legalName}</strong>, contact{" "}
          <a
            className="text-ds-ink underline underline-offset-2"
            href={`mailto:${publisher.dpoEmail}`}
          >
            {publisher.dpoEmail}
          </a>{" "}
          (ou {publisher.contactEmail}).
        </p>
      </LegalSection>

      <LegalSection title="3. Données collectées">
        <p>Selon votre usage, nous pouvons traiter :</p>
        <ul>
          <li>
            <strong>Identité & compte :</strong> e-mail, mot de passe (hashé
            par le prestataire d’auth), nom d’affichage éventuel.
          </li>
          <li>
            <strong>Acquisition / essai :</strong> e-mail fourni pour
            débloquer des crédits d’essai, horodatage, source technique.
          </li>
          <li>
            <strong>Contenus saisis :</strong> textes que vous soumettez au
            correcteur, brouillons, archives éventuelles liées à votre
            compte, métadonnées d’erreurs / stats d’usage.
          </li>
          <li>
            <strong>Abonnement & paiement :</strong> statut d’abonnement,
            identifiants de transaction fournis par le prestataire de
            paiement (nous ne stockons pas le numéro complet de carte).
          </li>
          <li>
            <strong>Technique :</strong> logs serveur, adresse IP, user-agent,
            cookies / stockage local nécessaires au service (session, locale,
            crédits d’essai).
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Finalités et bases légales">
        <ul>
          <li>
            <strong>Fourniture du service</strong> (correction, compte,
            playground) — exécution du contrat / mesures précontractuelles.
          </li>
          <li>
            <strong>Gestion des abonnements et facturation</strong> —
            exécution du contrat et obligations légales.
          </li>
          <li>
            <strong>Sécurité, prévention de la fraude et abus</strong> —
            intérêt légitime.
          </li>
          <li>
            <strong>Amélioration du produit</strong> (statistiques agrégées,
            qualité des corrections) — intérêt légitime, sans revente de vos
            textes à des tiers à des fins publicitaires.
          </li>
          <li>
            <strong>Support et communications de service</strong> — exécution
            du contrat / intérêt légitime.
          </li>
          <li>
            <strong>Obligations légales</strong> (comptabilité, réponses aux
            autorités compétentes).
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Contenus utilisateurs">
        <p>
          Les textes que vous saisissez sont traités <strong>uniquement</strong>{" "}
          pour fournir la fonctionnalité de correction et les services liés à
          votre compte. Vous restez responsable du contenu que vous
          choisissez de soumettre. Nous ne revendiquons pas la propriété de
          vos textes.
        </p>
        <p>
          Ne soumettez pas de données ultra-sensibles (santé, secrets
          professionnels stricts, données de tiers sans base légale) si vous
          n’avez pas le droit de le faire. Le service n’est pas conçu comme
          un coffre-fort pour secrets classifiés.
        </p>
      </LegalSection>

      <LegalSection title="6. Destinataires et sous-traitants">
        <p>
          Vos données peuvent être traitées par des prestataires techniques
          agissant pour notre compte, notamment : hébergement / infrastructure,
          authentification et base de données (ex. Supabase), outils de
          correction linguistique, et le cas échéant prestataire de paiement
          pour les abonnements.
        </p>
        <p>
          Ces prestataires n’agissent que sur instruction et dans le cadre de
          contrats de sous-traitance conformes au RGPD lorsque applicable.
        </p>
      </LegalSection>

      <LegalSection title="7. Transferts hors UE">
        <p>
          Si un prestataire est situé hors de l’Espace économique européen,
          nous veillons à encadrer le transfert par des garanties appropriées
          (clauses contractuelles types, etc.), sauf exception prévue par la
          réglementation.
        </p>
      </LegalSection>

      <LegalSection title="8. Durées de conservation">
        <ul>
          <li>
            <strong>Compte actif :</strong> pendant la durée du compte, puis
            suppression ou anonymisation dans un délai raisonnable après
            clôture (sauf obligation légale).
          </li>
          <li>
            <strong>Leads d’essai (e-mail) :</strong> durée nécessaire à la
            gestion de l’essai et au suivi commercial légitime, ou jusqu’à
            opposition.
          </li>
          <li>
            <strong>Logs techniques :</strong> durée limitée à des fins de
            sécurité et diagnostic.
          </li>
          <li>
            <strong>Données de facturation :</strong> délais légaux
            comptables et fiscaux.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="9. Cookies et stockage local">
        <p>
          Nous utilisons des cookies et technologies similaires{" "}
          <strong>essentiels</strong> au fonctionnement du service
          (authentification, préférences de langue, crédits d’essai, session).
          Ces éléments ne sont pas utilisés pour de la publicité comportementale
          tierce. Vous pouvez restreindre les cookies via votre navigateur,
          ce qui peut dégrader certaines fonctionnalités.
        </p>
      </LegalSection>

      <LegalSection title="10. Vos droits">
        <p>Vous disposez des droits d’accès, rectification, effacement,
          limitation, opposition, portabilité, et du droit de définir des
          directives post-mortem, dans les conditions prévues par la loi.</p>
        <p>
          Pour les exercer :{" "}
          <a
            className="text-ds-ink underline underline-offset-2"
            href={`mailto:${publisher.dpoEmail}`}
          >
            {publisher.dpoEmail}
          </a>
          . Vous pouvez également introduire une réclamation auprès de la
          CNIL (www.cnil.fr).
        </p>
      </LegalSection>

      <LegalSection title="11. Sécurité">
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles
          raisonnables pour protéger vos données. Aucun système n’étant
          infaillible, nous ne pouvons garantir une sécurité absolue.
        </p>
      </LegalSection>

      <LegalSection title="12. Mineurs">
        <p>
          Le service s’adresse à des personnes capables de contracter. Si vous
          avez moins de 15 ans (ou l’âge de la majorité numérique applicable),
          l’utilisation nécessite l’accord du titulaire de l’autorité
          parentale.
        </p>
      </LegalSection>

      <LegalSection title="13. Modifications">
        <p>
          Cette politique peut être mise à jour. La date en tête de page fait
          foi. En cas de changement substantiel, nous pourrons vous en
          informer via le site ou par e-mail.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
