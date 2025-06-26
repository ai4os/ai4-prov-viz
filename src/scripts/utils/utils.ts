export const miniIRI = (iri: string) => {
	return iri?.split('/').at(-1);
};

export const ruleToHReadable = (ontologyRule: string) : string => {
	if (!ontologyRule.includes('#')) return ontologyRule;
	const rule = ontologyRule.split('#')[1]
	let humanReadable = ""
	for (let char of rule) {
		let toAdd = char;
		if (char === char.toUpperCase()) {
			toAdd = " " + char.toLowerCase();
		}
		humanReadable += toAdd;
	}
	return humanReadable;
}

export const findProvIcon = (type: string, iri: string) => {
	const icons: Record<string, Record<string, string>> = {
		Agent: {
			Jenkins: '/icons/jenkins.svg',
			AI4EOSC: '/icons/ai4eosc.svg',
			MLflow: '/icons/mlflow.svg',
			Nomad: '/icons/nomad.svg',
			default: '/icons/defaultAgent.svg',
		},
		Activity: {
			default: '/icons/defaultActivity.svg',
		},
		Entity: {
			default: '/icons/defaultEntity.svg',
		},
		Collection: {
			default: '/icons/defaultCollection.svg',
		}
	};
	return icons[type][miniIRI(iri)!] ?? icons[type].default;
};


export const isObjectEmpty = (o: object) => {
	for (let _ in o) return false;
	return true;
}