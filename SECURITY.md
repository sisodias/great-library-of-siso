# Security policy

The Great Library of SISO is a public registry and generated static site. Its main security boundary is clean-room publication: private or sensitive operational material must never enter the registry, repository history, build artifact, logs, issues, or Pages site.

## Report a vulnerability privately

Use GitHub's **Security** tab and **Report a vulnerability** when private vulnerability reporting is available. If it is not available, contact a repository maintainer through a verified private organizational channel and ask for a secure reporting route.

Do not open a public issue or pull request containing a credential, exploit detail, private locator, client identifier, or unpublished incident evidence. In the first message, provide only a non-sensitive summary, likely impact, and a way to continue privately. Never paste live secret values.

Ordinary broken links, accessibility issues, and non-sensitive hardening suggestions may use the public issue tracker.

## Publication boundary

The following material is prohibited from public artifacts:

- secrets, credentials, tokens, private keys, session material, or realistic secret fixtures;
- private client source or client-identifying operational data;
- personal notes, machine-specific paths, usernames, or private topology;
- raw operational databases, exports, logs, or unclassified backups; and
- legacy source that has not been read, classified, and cleared for publication.

External upstream material must retain its real ownership and license. A public repository or URL is not sufficient evidence that the Library may redistribute its contents.

## Legacy credential incident

The clean-room gate incorporates a lesson from a legacy credential incident: credential material was found in legacy working material under review. That material must not be copied into this repository. This public policy intentionally omits the credential, provider, owner, value, file name, and machine path. Those details do not belong in public documentation, tests, examples, or commit history.

## Maintainer response

For a suspected sensitive publication, maintainers should:

1. stop the relevant publication or deployment without echoing the sensitive value;
2. preserve only non-sensitive evidence needed to identify the affected artifact;
3. notify the credential or data owner through a private channel so they can revoke, rotate, or otherwise contain it;
4. remove the unsafe public artifact and coordinate history remediation when necessary; and
5. rerun the full validation, link, build, and secret-scan gate before publication resumes.

Removal from the current branch or Pages site is not proof that a secret is safe. Rotation/revocation belongs to the secret owner and must be handled outside the public repository.

---

The Great Library of SISO — Built by the SISO Open Source Foundation · Funded by SISO Agency.
