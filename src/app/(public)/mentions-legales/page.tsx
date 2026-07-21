import type { Metadata } from "next";
import { LegalDocument, LegalSection } from "@/shared/legal/legal-document";
import { SITE_LEGAL } from "@/shared/legal/site-legal";

export const metadata: Metadata = {
  title: "Mentions légales — Text Corrector",
  description:
    "Mentions légales du service Text Corrector : éditeur, hébergeur et informations légales.",
};

export default function MentionsLegalesPage() {
  const { publisher, host } = SITE_LEGAL;

  return (
    <LegalDocument title="Mentions légales">
      <LegalSection title="1. Éditeur du site">
        <p>
          Le site et le service <strong>{SITE_LEGAL.brandName}</strong>{" "}
          accessibles à l’adresse{" "}
          <strong>{SITE_LEGAL.siteUrl}</strong> sont édités par :
        </p>
        <ul>
          <li>
            <strong>Nom / raison sociale :</strong> {publisher.legalName}
          </li>
          <li>
            <strong>Forme :</strong> {publisher.legalForm}
          </li>
          <li>
            <strong>Adresse :</strong> {publisher.address}
          </li>
          <li>
            <strong>SIRET :</strong> {publisher.siret}
          </li>
          <li>
            <strong>Immatriculation :</strong> {publisher.rcs}
          </li>
          <li>
            <strong>Directeur de la publication :</strong> {publisher.director}
          </li>
          <li>
            <strong>Contact :</strong>{" "}
            <a
              className="text-ds-ink underline underline-offset-2"
              href={`mailto:${publisher.contactEmail}`}
            >
              {publisher.contactEmail}
            </a>
          </li>
        </ul>
        <p>
          Les mentions d’identité juridique ci-dessus doivent être complétées
          avec les informations officielles de l’éditeur avant toute
          commercialisation d’abonnements.
        </p>
      </LegalSection>

      <LegalSection title="2. Hébergement">
        <ul>
          <li>
            <strong>Hébergeur :</strong> {host.name}
          </li>
          <li>
            <strong>Adresse :</strong> {host.address}
          </li>
          <li>
            <strong>Site :</strong> {host.website}
          </li>
        </ul>
        <p>{host.note}</p>
      </LegalSection>

      <LegalSection title="3. Nature du service">
        <p>
          {SITE_LEGAL.brandName} est un service logiciel en ligne (SaaS)
          proposant des outils d’aide à la correction de textes (orthographe,
          grammaire, style et fonctionnalités associées), accessible via un
          compte utilisateur et, le cas échéant, via des formules
          d’abonnement payantes.
        </p>
      </LegalSection>

      <LegalSection title="4. Propriété intellectuelle">
        <p>
          L’ensemble des éléments du site (marques, logos, textes
          institutionnels, interface, code, design, bases de données) est
          protégé. Toute reproduction, extraction ou réutilisation non
          autorisée est interdite, sauf usage strictement personnel et
          non commercial du service dans le cadre prévu par les CGU.
        </p>
        <p>
          Les contenus saisis par les utilisateurs restent leur propriété ;
          l’éditeur n’acquiert aucun droit de propriété sur ces contenus,
          sous réserve des licences limitées nécessaires au fonctionnement
          technique du service (voir CGU).
        </p>
      </LegalSection>

      <LegalSection title="5. Responsabilité">
        <p>
          L’éditeur s’efforce d’assurer la disponibilité et la sécurité du
          service, sans garantie d’absence d’interruption ou d’erreur. Le
          service constitue une <strong>aide automatisée</strong> à la
          rédaction et ne remplace pas un contrôle humain, un conseil
          juridique, médical, financier ou professionnel.
        </p>
        <p>
          L’éditeur ne saurait être tenu responsable des contenus publiés,
          transmis, stockés ou corrigés par les utilisateurs, ni des
          décisions prises sur la base des suggestions du service. Pour le
          détail des limitations, voir les{" "}
          <a className="text-ds-ink underline underline-offset-2" href="/cgu">
            Conditions Générales d’Utilisation
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="6. Données personnelles">
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

      <LegalSection title="7. Droit applicable">
        <p>
          Les présentes mentions sont régies par le droit français. En cas de
          litige, et à défaut de résolution amiable, les tribunaux français
          compétents seront seuls compétents, sous réserve des règles
          impératives de protection du consommateur.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
