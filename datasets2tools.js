//////////////////////////////////////////////////////////////////////
///////// 1. Define Main Function ////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////// Author: Denis Torre
////////// Affiliation: Ma'ayan Laboratory, Icahn School of Medicine at Mount Sinai
////////// Based on Cite-D-Lite (https://github.com/MaayanLab/Cite-D-Lite).

function main() {

	// Locate parents on HTML page
	var $parents = Interface.locateParents();

	// Get Canned Analyses of corresponding datasets
	var cannedAnalysisData = API.main($parents);

	// Add Canned Analyses to the webpage
	Interface.addCannedAnalyses($parents, cannedAnalysisData);

	// Add event listeners for interactivity
	eventListener.main(cannedAnalysisData);
}

//////////////////////////////////////////////////////////////////////
///////// 2. Define Variables ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////
////////// 1. Page ///////////////////////////////
//////////////////////////////////////////////////

///// Functions related to the webpage.

var Page = {

	//////////////////////////////
	///// 1. isDataMedSearchResults
	//////////////////////////////

	///// Returns true if the user is on a DataMed search results page, otherwise false

	isDataMedSearchResults: function() {
		// return /https:\/\/datamed\.org\/search\.php\?.*/.test(window.location.href);
		return /.*datamed_search.*/.test(window.location.href);
	},

	//////////////////////////////
	///// 2. isDataMedLanding
	//////////////////////////////

	///// Returns true if the user is on a DataMed dataset landing page, otherwise false

	isDataMedLanding: function() {
		// return /https:\/\/datamed\.org\/display\-item\.php\?.*/.test(window.location.href);
		return /.*datamed_landing.*/.test(window.location.href);
	},

	//////////////////////////////
	///// 3. getLabel
	//////////////////////////////

	///// Returns labels according to location, used for CSS formatting

	getLabel: function() {
		var self = this;
		if (self.isDataMedSearchResults()) {
			return 'datamed datamed-search';
		} else if (self.isDataMedLanding()) {
			return 'datamed datamed-landing';
		}
	}
};

//////////////////////////////////////////////////
////////// 2. Interface //////////////////////////
//////////////////////////////////////////////////

///// Functions related to preparing and loading the interfaces.

var Interface = {

	//////////////////////////////
	///// 1. locateParents
	//////////////////////////////

	///// Locates HTML elements which will be used to extract dataset accessions and append the interfaces

	locateParents: function() {
		var $parents;
		if (Page.isDataMedSearchResults()) {
			$parents = $('.search-result li');
		} else if (Page.isDataMedLanding()) {
			$parents = $('a:contains("Dataset")').parents('.panel-group');
		}
		return $parents;
	},

	//////////////////////////////
	///// 2. getDatasetAccession
	//////////////////////////////

	///// Extracts the dataset accession from a parent element identified above

	getDatasetAccession: function($parents) {
		var datasetAccession;
		if (Page.isDataMedSearchResults()) {
			datasetAccession = $parents.find(".result-field em:contains('ID:'), em:contains('Accession:')").next().text().replace(/\s+/g, '');
		} else if (Page.isDataMedLanding()) {
			datasetAccession = $parents.find('td:contains("ID:")').next().children().eq(0).text().replace(/\s+/g, '');
		}
		return datasetAccession;
	},

	//////////////////////////////
	///// 3. addCannedAnalyses
	//////////////////////////////

	///// Prepares and adds canned analysis interface to the parent element, given the canned analysis data

	addCannedAnalyses: function($parents, cannedAnalysisData) {
		var self = this;
		if (Page.isDataMedSearchResults()) {
			$($parents).each(function(i, elem){
				datasetAccession = self.getDatasetAccession($(elem));
				if ($.inArray(datasetAccession, Object.keys(cannedAnalysisData['canned_analyses'])) > -1) {
					var toolbarHTML = toolbar.getHTML(datasetAccession, cannedAnalysisData);
					$parents.eq(i).append(toolbarHTML);
				}
			})
		} else if (Page.isDataMedLanding()) {
			var self = this, datasetAccessionString = self.getDatasetAccession($parents), toolbarHTML = tooltable.getHTML(datasetAccessionString, cannedAnalysisData);
			tooltable.add($parents, toolbarHTML);
		}
	}
};

//////////////////////////////////////////////////
////////// 3. API ////////////////////////////////
//////////////////////////////////////////////////

///// Function related to getting canned analyses from the Datasets2Tools database.

var API = {

	//////////////////////////////
	///// 1. main
	//////////////////////////////

	///// Gets canned analysis data, given the parents

	main: function($parents) {
		// var apiURL = 'https://amp.pharm.mssm.edu/datasets2tools/data?';
		// if (Object.keys($parents).length > 1) {
		// 	var datasetAccession, datasetAccessionArray = [];
		// 	$($parents).each(function(i, elem) {
		// 		datasetAccession = Interface.getDatasetAccession($(elem));
		// 		datasetAccessionArray.push(datasetAccession);
		// 	})
		// 	apiURL += datasetAccessionArray.join('+');
		// } else {
		// 	apiURL += Interface.getDatasetAccession($parents);
		// }
		// $.ajax({
		// 	type: "GET",
		// 	url: apiURL,
		// 	async: false,
		// 	success: function(text) {
		// 		cannedAnalysisData = JSON.parse(text);
		// 	}
		// });
		
		// demonstration only for the static website - will update when goes live
		cannedAnalysisData = {"tools":{"1":{"tool_icon_url":"http://amp.pharm.mssm.edu/Enrichr/images/enrichr-icon.png","tool_homepage_url":"http://amp.pharm.mssm.edu/Enrichr","doi":"10.1186/1471-2105-14-128","tool_name":"Enrichr","tool_description":"An intuitive web-based gene list enrichment analysis tool with 90 libraries"},"11":{"tool_icon_url":"http://amp.pharm.mssm.edu/L1000CDS2/CSS/images/sigine.png","tool_homepage_url":"http://amp.pharm.mssm.edu/L1000CDS2","doi":null,"tool_name":"L1000CDS2","tool_description":"An ultra-fast LINCS L1000 Characteristic Direction signature search engine"},"13":{"tool_icon_url":"http://amp.pharm.mssm.edu/g2e/static/image/targetapp/paea.png","tool_homepage_url":"http://amp.pharm.mssm.edu/PAEA","doi":"10.1109/BIBM.2015.7359689","tool_name":"PAEA","tool_description":"Enrichment analysis tool implementing the principal angle method"}},"canned_analyses":{"GSE11352":{"1":{"79883":{"cutoff":"500.0","direction":"1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=50pj"},"79884":{"cutoff":"500.0","direction":"-1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=50pk"},"79885":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=50pl"}},"11":{"80256":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56f9678b520166ee00bcb342"}},"13":{"80482":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=1089138"}}},"GSE19777":{"1":{"78537":{"cutoff":"500.0","direction":"1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4ybk"},"78538":{"cutoff":"500.0","direction":"-1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4ybl"},"78539":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4ybm"},"78540":{"cutoff":"500.0","direction":"1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4ybo"},"78541":{"cutoff":"500.0","direction":"-1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4ybp"},"78542":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4ybq"}},"11":{"79059":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56f6610c520166ee00bcae22"},"79060":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56f66138520166ee00bcae24"}},"13":{"79266":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=1086041"},"79267":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=1086045"}}},"GSE30931":{"1":{"79841":{"cutoff":"500.0","direction":"1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=50nm"},"79842":{"cutoff":"500.0","direction":"-1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=50nn"},"79843":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=50no"}},"11":{"80242":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56f96551520166ee00bcb320"}},"13":{"80468":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=1089069"}}},"GSE32161":{"1":{"80719":{"cutoff":"500.0","direction":"1.0","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method","smiles":"CC1=C(C(CCC1)(C)C)C=CC(=CC=CC(=CC(=O)O)C)C","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=51mx","diff_exp_method":"chdir"},"80720":{"cutoff":"500.0","direction":"-1.0","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method","smiles":"CC1=C(C(CCC1)(C)C)C=CC(=CC=CC(=CC(=O)O)C)C","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=51n2","diff_exp_method":"chdir"},"80721":{"cutoff":"500.0","direction":"0.0","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","smiles":"CC1=C(C(CCC1)(C)C)C=CC(=CC=CC(=CC(=O)O)C)C","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=51n3","diff_exp_method":"chdir"}},"11":{"81293":{"cutoff":"500.0","direction":"0.0","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","smiles":"CC1=C(C(CCC1)(C)C)C=CC(=CC=CC(=CC(=O)O)C)C","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56f986ea520166ee00bcb4e8","diff_exp_method":"chdir"}},"13":{"81520":{"cutoff":"500.0","direction":"0.0","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","smiles":"CC1=C(C(CCC1)(C)C)C=CC(=CC=CC(=CC(=O)O)C)C","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=1090347","diff_exp_method":"chdir"}}},"GSE26459":{"1":{"68315":{"cutoff":"500.0","direction":"1.0","perturbation":"Tamoxifen","description":"Enrichment analysis of the top 500 most overexpressed genes, Tamoxifen perturbation, Breast Cancer disease, MCF7 -B7 Tamoxifen Sensitive Breast cancer cell, chdir diff_exp_method","disease":"Breast Cancer","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1qe1","cell":"MCF7 -B7 Tamoxifen Sensitive Breast cancer","diff_exp_method":"chdir"},"68316":{"cutoff":"500.0","direction":"-1.0","perturbation":"Tamoxifen","description":"Enrichment analysis of the top 500 most underexpressed genes, Tamoxifen perturbation, Breast Cancer disease, MCF7 -B7 Tamoxifen Sensitive Breast cancer cell, chdir diff_exp_method","disease":"Breast Cancer","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1qe2","cell":"MCF7 -B7 Tamoxifen Sensitive Breast cancer","diff_exp_method":"chdir"},"68317":{"cutoff":"500.0","direction":"0.0","perturbation":"Tamoxifen","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, Tamoxifen perturbation, Breast Cancer disease, MCF7 -B7 Tamoxifen Sensitive Breast cancer cell, chdir diff_exp_method","disease":"Breast Cancer","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1qe3","cell":"MCF7 -B7 Tamoxifen Sensitive Breast cancer","diff_exp_method":"chdir"},"68318":{"cutoff":"500.0","direction":"1.0","perturbation":"Tamoxifen","description":"Enrichment analysis of the top 500 most overexpressed genes, Tamoxifen perturbation, Breast Cancer disease, MCF7 -G11 Tamoxifen Resistant Breast cancer cell, chdir diff_exp_method","disease":"Breast Cancer","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1qe4","cell":"MCF7 -G11 Tamoxifen Resistant Breast cancer","diff_exp_method":"chdir"},"68319":{"cutoff":"500.0","direction":"-1.0","perturbation":"Tamoxifen","description":"Enrichment analysis of the top 500 most underexpressed genes, Tamoxifen perturbation, Breast Cancer disease, MCF7 -G11 Tamoxifen Resistant Breast cancer cell, chdir diff_exp_method","disease":"Breast Cancer","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1qe5","cell":"MCF7 -G11 Tamoxifen Resistant Breast cancer","diff_exp_method":"chdir"},"68320":{"cutoff":"500.0","direction":"0.0","perturbation":"Tamoxifen","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, Tamoxifen perturbation, Breast Cancer disease, MCF7 -G11 Tamoxifen Resistant Breast cancer cell, chdir diff_exp_method","disease":"Breast Cancer","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1qe6","cell":"MCF7 -G11 Tamoxifen Resistant Breast cancer","diff_exp_method":"chdir"}},"11":{"68900":{"cutoff":"500.0","direction":"0.0","perturbation":"Tamoxifen","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, Tamoxifen perturbation, Breast Cancer disease, MCF7 -B7 Tamoxifen Sensitive Breast cancer cell, chdir diff_exp_method","disease":"Breast Cancer","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/5654cca97b75730401400fb0","cell":"MCF7 -B7 Tamoxifen Sensitive Breast cancer","diff_exp_method":"chdir"},"68901":{"cutoff":"500.0","direction":"0.0","perturbation":"Tamoxifen","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, Tamoxifen perturbation, Breast Cancer disease, MCF7 -G11 Tamoxifen Resistant Breast cancer cell, chdir diff_exp_method","disease":"Breast Cancer","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/5654cd077b75730401400fb2","cell":"MCF7 -G11 Tamoxifen Resistant Breast cancer","diff_exp_method":"chdir"}},"13":{"69113":{"cutoff":"500.0","direction":"0.0","perturbation":"Tamoxifen","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, Tamoxifen perturbation, Breast Cancer disease, MCF7 -B7 Tamoxifen Sensitive Breast cancer cell, chdir diff_exp_method","disease":"Breast Cancer","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=634257","cell":"MCF7 -B7 Tamoxifen Sensitive Breast cancer","diff_exp_method":"chdir"},"69114":{"cutoff":"500.0","direction":"0.0","perturbation":"Tamoxifen","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, Tamoxifen perturbation, Breast Cancer disease, MCF7 -G11 Tamoxifen Resistant Breast cancer cell, chdir diff_exp_method","disease":"Breast Cancer","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=634262","cell":"MCF7 -G11 Tamoxifen Resistant Breast cancer","diff_exp_method":"chdir"}}},"GSE27473":{"1":{"78534":{"cutoff":"500.0","direction":"1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4ybg"},"78535":{"cutoff":"500.0","direction":"-1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4ybh"},"78536":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4ybi"}},"11":{"79058":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56f660df520166ee00bcae20"}},"13":{"79265":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=1086037"}}},"GSE8565":{"1":{"79973":{"cutoff":"500.0","direction":"1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=50w0"},"79974":{"cutoff":"500.0","direction":"-1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=50w1"},"79975":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=50w2"},"79976":{"cutoff":"500.0","direction":"1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=50w4"},"79977":{"cutoff":"500.0","direction":"-1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=50w5"},"79978":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=50w6"}},"11":{"80286":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56f96fee520166ee00bcb3b2"},"80287":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56f9701d520166ee00bcb3b4"}},"13":{"80512":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=1089371"},"80513":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=1089375"}}},"GSE45643":{"1":{"58087":{"cutoff":"500.0","direction":"1.0","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1jxq","diff_exp_method":"chdir"},"58088":{"cutoff":"500.0","direction":"-1.0","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1jxr","diff_exp_method":"chdir"},"58089":{"cutoff":"500.0","direction":"0.0","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1jxs","diff_exp_method":"chdir"},"58090":{"cutoff":"500.0","direction":"1.0","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1jxt","diff_exp_method":"chdir"},"58091":{"cutoff":"500.0","direction":"-1.0","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1jxu","diff_exp_method":"chdir"},"58092":{"cutoff":"500.0","direction":"0.0","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1jxv","diff_exp_method":"chdir"},"58093":{"cutoff":"500.0","direction":"1.0","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1jxw","diff_exp_method":"chdir"},"58094":{"cutoff":"500.0","direction":"-1.0","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1jxx","diff_exp_method":"chdir"},"58095":{"cutoff":"500.0","direction":"0.0","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1jxy","diff_exp_method":"chdir"},"58096":{"cutoff":"500.0","direction":"1.0","description":"Enrichment analysis of the top 500 most overexpressed genes, Homo sapiens organism, chdir diff_exp_method","organism":"Homo sapiens","cell_type":"MCF7cells","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1k8m","pert_id":"CHEBI:23965","pert_name":"estradiol","diff_exp_method":"chdir","pert_type":"chemical"},"58097":{"cutoff":"500.0","direction":"-1.0","description":"Enrichment analysis of the top 500 most underexpressed genes, Homo sapiens organism, chdir diff_exp_method","organism":"Homo sapiens","cell_type":"MCF7cells","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1k8n","pert_id":"CHEBI:23965","pert_name":"estradiol","diff_exp_method":"chdir","pert_type":"chemical"},"58098":{"cutoff":"500.0","direction":"0.0","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, Homo sapiens organism, chdir diff_exp_method","organism":"Homo sapiens","cell_type":"MCF7cells","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1k8o","pert_id":"CHEBI:23965","pert_name":"estradiol","diff_exp_method":"chdir","pert_type":"chemical"}},"11":{"58562":{"cutoff":"500.0","direction":"0.0","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/560c0e2656694ef6008739fc","diff_exp_method":"chdir"},"58563":{"cutoff":"500.0","direction":"0.0","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/560c0e5d56694ef6008739fe","diff_exp_method":"chdir"},"58564":{"cutoff":"500.0","direction":"0.0","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/560c0ee956694ef600873a00","diff_exp_method":"chdir"},"58565":{"cutoff":"500.0","direction":"0.0","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, Homo sapiens organism, chdir diff_exp_method","organism":"Homo sapiens","cell_type":"MCF7cells","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/560c6a1456694ef600873b0a","pert_id":"CHEBI:23965","pert_name":"estradiol","diff_exp_method":"chdir","pert_type":"chemical"}},"13":{"58776":{"cutoff":"500.0","direction":"0.0","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=487261","diff_exp_method":"chdir"},"58777":{"cutoff":"500.0","direction":"0.0","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=487265","diff_exp_method":"chdir"},"58778":{"cutoff":"500.0","direction":"0.0","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=487269","diff_exp_method":"chdir"},"58779":{"cutoff":"500.0","direction":"0.0","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, Homo sapiens organism, chdir diff_exp_method","organism":"Homo sapiens","cell_type":"MCF7cells","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=487889","pert_id":"CHEBI:23965","pert_name":"estradiol","diff_exp_method":"chdir","pert_type":"chemical"}}},"GSE26298":{"1":{"55873":{"cutoff":"500.0","direction":"1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1j4j"},"55874":{"cutoff":"500.0","direction":"-1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1j4k"},"55875":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1j4l"},"55876":{"cutoff":"500.0","direction":"1.0","perturbation":"Tamoxifen (100nM)","description":"Enrichment analysis of the top 500 most overexpressed genes, Tamoxifen (100nM) perturbation, Breast Cancer disease, Breast Cancer cell, chdir diff_exp_method","disease":"Breast Cancer","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1qci","cell":"Breast Cancer","diff_exp_method":"chdir"},"55877":{"cutoff":"500.0","direction":"-1.0","perturbation":"Tamoxifen (100nM)","description":"Enrichment analysis of the top 500 most underexpressed genes, Tamoxifen (100nM) perturbation, Breast Cancer disease, Breast Cancer cell, chdir diff_exp_method","disease":"Breast Cancer","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1qcj","cell":"Breast Cancer","diff_exp_method":"chdir"},"55878":{"cutoff":"500.0","direction":"0.0","perturbation":"Tamoxifen (100nM)","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, Tamoxifen (100nM) perturbation, Breast Cancer disease, Breast Cancer cell, chdir diff_exp_method","disease":"Breast Cancer","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1qck","cell":"Breast Cancer","diff_exp_method":"chdir"},"55879":{"cutoff":"500.0","direction":"1.0","perturbation":"Tamoxifen (500nM)","description":"Enrichment analysis of the top 500 most overexpressed genes, Tamoxifen (500nM) perturbation, Breast Cancer disease, Breast Cancer cell, chdir diff_exp_method","disease":"Breast Cancer","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1qcl","cell":"Breast Cancer","diff_exp_method":"chdir"},"55880":{"cutoff":"500.0","direction":"-1.0","perturbation":"Tamoxifen (500nM)","description":"Enrichment analysis of the top 500 most underexpressed genes, Tamoxifen (500nM) perturbation, Breast Cancer disease, Breast Cancer cell, chdir diff_exp_method","disease":"Breast Cancer","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1qcm","cell":"Breast Cancer","diff_exp_method":"chdir"},"55881":{"cutoff":"500.0","direction":"0.0","perturbation":"Tamoxifen (500nM)","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, Tamoxifen (500nM) perturbation, Breast Cancer disease, Breast Cancer cell, chdir diff_exp_method","disease":"Breast Cancer","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1qcn","cell":"Breast Cancer","diff_exp_method":"chdir"},"55882":{"cutoff":"500.0","direction":"1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4yb8"},"55883":{"cutoff":"500.0","direction":"-1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4yb9"},"55884":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4yba"},"55885":{"cutoff":"500.0","direction":"1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4yw5"},"55886":{"cutoff":"500.0","direction":"-1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4yw6"},"55887":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4yw7"},"55888":{"cutoff":"500.0","direction":"1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=51nj"},"55889":{"cutoff":"500.0","direction":"-1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=51no"},"55890":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=51np"},"55891":{"cutoff":"500.0","direction":"1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=51o4"},"55892":{"cutoff":"500.0","direction":"-1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=51o9"},"55893":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=51oa"}},"11":{"56336":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/5602eb4a56694ef6008736c2"},"56337":{"cutoff":"500.0","direction":"0.0","perturbation":"Tamoxifen (100nM)","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, Tamoxifen (100nM) perturbation, Breast Cancer disease, Breast Cancer cell, chdir diff_exp_method","disease":"Breast Cancer","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56539f2f7b75730401400f56","cell":"Breast Cancer","diff_exp_method":"chdir"},"56338":{"cutoff":"500.0","direction":"0.0","perturbation":"Tamoxifen (500nM)","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, Tamoxifen (500nM) perturbation, Breast Cancer disease, Breast Cancer cell, chdir diff_exp_method","disease":"Breast Cancer","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56539f7a7b75730401400f58","cell":"Breast Cancer","diff_exp_method":"chdir"},"56339":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56f6608e520166ee00bcae1c"},"56340":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56f67b77520166ee00bcaf94"},"56341":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56f98716520166ee00bcb4ea"},"56342":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56f98741520166ee00bcb4ec"}},"13":{"56575":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=483807"},"56576":{"cutoff":"500.0","direction":"0.0","perturbation":"Tamoxifen (100nM)","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, Tamoxifen (100nM) perturbation, Breast Cancer disease, Breast Cancer cell, chdir diff_exp_method","disease":"Breast Cancer","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=633882","cell":"Breast Cancer","diff_exp_method":"chdir"},"56577":{"cutoff":"500.0","direction":"0.0","perturbation":"Tamoxifen (500nM)","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, Tamoxifen (500nM) perturbation, Breast Cancer disease, Breast Cancer cell, chdir diff_exp_method","disease":"Breast Cancer","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=633886","cell":"Breast Cancer","diff_exp_method":"chdir"},"56578":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=1086029"},"56579":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=1086782"},"56580":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=1090369"},"56581":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=1090389"}}},"GSE24592":{"1":{"44004":{"cutoff":"500.0","direction":"1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1emg"},"44005":{"cutoff":"500.0","direction":"-1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1emh"},"44006":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1emi"},"44007":{"cutoff":"500.0","direction":"1.0","description":"Enrichment analysis of the top 500 most overexpressed genes, human organism, chdir diff_exp_method","organism":"human","cell_type":"MCF-7","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4ufi","diff_exp_method":"chdir","pert_type":"KD"},"44008":{"cutoff":"500.0","direction":"-1.0","description":"Enrichment analysis of the top 500 most underexpressed genes, human organism, chdir diff_exp_method","organism":"human","cell_type":"MCF-7","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4ufj","diff_exp_method":"chdir","pert_type":"KD"},"44009":{"cutoff":"500.0","direction":"0.0","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, human organism, chdir diff_exp_method","organism":"human","cell_type":"MCF-7","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4ufk","diff_exp_method":"chdir","pert_type":"KD"},"44010":{"cutoff":"500.0","direction":"1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4x83"},"44011":{"cutoff":"500.0","direction":"-1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4x84"},"44012":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4x85"},"44013":{"cutoff":"500.0","direction":"1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=50pv"},"44014":{"cutoff":"500.0","direction":"-1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=50pw"},"44015":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=50px"},"44016":{"cutoff":"500.0","direction":"1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=52jh"},"44017":{"cutoff":"500.0","direction":"-1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=52jk"},"44018":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=52jl"},"44019":{"cutoff":"500.0","direction":"1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=52kd"},"44020":{"cutoff":"500.0","direction":"-1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=52kg"},"44021":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=52ki"},"44022":{"cutoff":"500.0","direction":"1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=52kq"},"44023":{"cutoff":"500.0","direction":"-1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=52kt"},"44024":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=52ku"},"44025":{"cutoff":"500.0","direction":"1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=6obq"},"44026":{"cutoff":"500.0","direction":"-1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=6obr"},"44027":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=6obt"}},"11":{"44702":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/55e85b17106cbaf600a59050"},"44703":{"cutoff":"500.0","direction":"0.0","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, human organism, chdir diff_exp_method","organism":"human","cell_type":"MCF-7","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56f5b1c8520166ee00bca486","diff_exp_method":"chdir","pert_type":"KD"},"44704":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56f62e9a520166ee00bcab68"},"44705":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56f967fe520166ee00bcb348"},"44706":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56f992ea520166ee00bcb58e"},"44707":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56f99331520166ee00bcb592"},"44708":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56f9934e520166ee00bcb594"}},"13":{"44940":{"cutoff":"500.0","direction":"0.0","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, human organism, chdir diff_exp_method","organism":"human","cell_type":"MCF-7","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=1081000","diff_exp_method":"chdir","pert_type":"KD"},"44941":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=1084620"},"44942":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=1089150"},"44943":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=1091516"},"44944":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=1091548"},"44945":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=1091561"},"44946":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=1166410"}}},"GSE35696":{"1":{"52410":{"cutoff":"500.0","direction":"1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1hf5"},"52411":{"cutoff":"500.0","direction":"-1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1hf6"},"52412":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1hf7"},"52413":{"cutoff":"500.0","direction":"1.0","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1kzs","diff_exp_method":"chdir"},"52414":{"cutoff":"500.0","direction":"-1.0","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1kzt","diff_exp_method":"chdir"},"52415":{"cutoff":"500.0","direction":"0.0","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1kzu","diff_exp_method":"chdir"},"52416":{"cutoff":"500.0","direction":"1.0","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1kzv","diff_exp_method":"chdir"},"52417":{"cutoff":"500.0","direction":"-1.0","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1kzw","diff_exp_method":"chdir"},"52418":{"cutoff":"500.0","direction":"0.0","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1kzx","diff_exp_method":"chdir"},"52419":{"cutoff":"500.0","direction":"1.0","description":"Enrichment analysis of the top 500 most overexpressed genes, human organism, chdir diff_exp_method","organism":"human","cell_type":"MCF7","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4sht","diff_exp_method":"chdir","pert_type":"knock-down (with LIF agent treatment)"},"52420":{"cutoff":"500.0","direction":"-1.0","description":"Enrichment analysis of the top 500 most underexpressed genes, human organism, chdir diff_exp_method","organism":"human","cell_type":"MCF7","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4shu","diff_exp_method":"chdir","pert_type":"knock-down (with LIF agent treatment)"},"52421":{"cutoff":"500.0","direction":"0.0","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, human organism, chdir diff_exp_method","organism":"human","cell_type":"MCF7","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4shv","diff_exp_method":"chdir","pert_type":"knock-down (with LIF agent treatment)"},"52422":{"cutoff":"500.0","direction":"1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4xvq"},"52423":{"cutoff":"500.0","direction":"-1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4xvr"},"52424":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4xvs"},"52425":{"cutoff":"500.0","direction":"1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4z7p"},"52426":{"cutoff":"500.0","direction":"-1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4z7q"},"52427":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=4z7r"}},"11":{"52795":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/55ee30e2121dfcf600e7886a"},"52796":{"cutoff":"500.0","direction":"0.0","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56117f5956694ef600873dca","diff_exp_method":"chdir"},"52797":{"cutoff":"500.0","direction":"0.0","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56117fc656694ef600873dcc","diff_exp_method":"chdir"},"52798":{"cutoff":"500.0","direction":"0.0","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, human organism, chdir diff_exp_method","organism":"human","cell_type":"MCF7","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56f560e3520166ee00bca00a","diff_exp_method":"chdir","pert_type":"knock-down (with LIF agent treatment)"},"52799":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56f64d31520166ee00bcad0a"},"52800":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56f689aa520166ee00bcb05e"}},"13":{"52957":{"cutoff":"500.0","direction":"0.0","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=490022","diff_exp_method":"chdir"},"52958":{"cutoff":"500.0","direction":"0.0","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=490026","diff_exp_method":"chdir"},"52959":{"cutoff":"500.0","direction":"0.0","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, human organism, chdir diff_exp_method","organism":"human","cell_type":"MCF7","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=1078490","diff_exp_method":"chdir","pert_type":"knock-down (with LIF agent treatment)"},"52960":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=1085471"},"52961":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=1087198"}}},"GSE56265":{"1":{"58108":{"cutoff":"500.0","direction":"1.0","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1jyh","diff_exp_method":"chdir"},"58109":{"cutoff":"500.0","direction":"-1.0","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1jyi","diff_exp_method":"chdir"},"58110":{"cutoff":"500.0","direction":"0.0","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1jyj","diff_exp_method":"chdir"},"58111":{"cutoff":"500.0","direction":"1.0","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1kks","diff_exp_method":"chdir"},"58112":{"cutoff":"500.0","direction":"-1.0","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1kkt","diff_exp_method":"chdir"},"58113":{"cutoff":"500.0","direction":"0.0","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=1kku","diff_exp_method":"chdir"},"58114":{"cutoff":"500.0","direction":"1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=40cq"},"58115":{"cutoff":"500.0","direction":"-1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=40cr"},"58116":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=40cs"},"58117":{"cutoff":"500.0","direction":"1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=40d0"},"58118":{"cutoff":"500.0","direction":"-1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=40d1"},"58119":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=40d2"},"58120":{"cutoff":"500.0","direction":"1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=40dh"},"58121":{"cutoff":"500.0","direction":"-1.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 most underexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=40dj"},"58122":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/Enrichr/enrich?dataset=40dk"}},"11":{"58569":{"cutoff":"500.0","direction":"0.0","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/560c14f256694ef600873a14","diff_exp_method":"chdir"},"58570":{"cutoff":"500.0","direction":"0.0","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/560db57256694ef600873bfa","diff_exp_method":"chdir"},"58571":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56b38244e68dfdee0009e0d3"},"58572":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56b38379e68dfdee0009e0d7"},"58573":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Signature search of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/L1000CDS2/#/result/56b3848fe68dfdee0009e0df"}},"13":{"58783":{"cutoff":"500.0","direction":"0.0","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=487304","diff_exp_method":"chdir"},"58784":{"cutoff":"500.0","direction":"0.0","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method, Homo sapiens organism","organism":"Homo sapiens","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=488829","diff_exp_method":"chdir"},"58785":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=1041966"},"58786":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=1041977"},"58787":{"cutoff":"500.0","direction":"0.0","diff_exp_method":"chdir","description":"Principal angle enrichment analysis of the top 500 combined underexpressed and overexpressed genes, chdir diff_exp_method","canned_analysis_url":"http://amp.pharm.mssm.edu/PAEA?id=1041996"}}}}};
		return cannedAnalysisData;
	}
};

//////////////////////////////////////////////////
////////// 4. toolbar ////////////////////////////
//////////////////////////////////////////////////

///// Functions related to preparing the Datasets2Tools toolbar for dataset search results pages.

var toolbar = {

	//////////////////////////////
	///// 1. getToolTabHTML
	//////////////////////////////

	///// Function to prepare the tool tab HTML (the element containing the tool icons).  Will be expanded when there are 5+ tools for GEO datasets.

	getToolTabHTML: function(datasetAccessionString, cannedAnalysisData) {
		var toolbarHTML = '<div class="datasets2tools-tool-icon-tab datasets2tools-compact">', toolIds, toolId, nrCannedAnalyses;
		toolIds = Object.keys(cannedAnalysisData['canned_analyses'][datasetAccessionString]);
		for (var i = 0; i < toolIds.length; i++) {
			toolId = toolIds[i];
			nrCannedAnalyses = Object.keys(cannedAnalysisData['canned_analyses'][datasetAccessionString][toolId]).length;
			toolbarHTML += '<div class="datasets2tools-tooltip-hover datasets2tools-toolicon-tooltip-hover"><button class="datasets2tools-tool-icon-button datasets2tools-button" id="' + toolId + '" type="button" style="background:url(' + cannedAnalysisData['tools'][toolId]['tool_icon_url'] + ') no-repeat;background-size:95%;background-position:center;"></button><div class="datasets2tools-tooltip-text datasets2tools-toolicon-tooltip-text"><b>' + cannedAnalysisData['tools'][toolId]['tool_name'] + '</b><p><i>' + nrCannedAnalyses + ' canned analyses</i></p><p>' + cannedAnalysisData['tools'][toolId]['tool_description'] + '</p></div></div>'
		}
		toolbarHTML += '</div>'
		return toolbarHTML;
	},

	//////////////////////////////
	///// 2. getHTML
	//////////////////////////////

	///// Function to prepare the toolbar HTML.

	getHTML: function(datasetAccessionString, cannedAnalysisData) {
		var self = this,
			interfaceHTML,
			toolbarHTML = '<div class="datasets2tools-toolbar datasets2tools-main ' + Page.getLabel() + '" id="' + datasetAccessionString + '">', //datasets2tools-
			searchBarHTML = '<div class="datasets2tools-search-bar">',
			logoTabHTML = '<div class="datasets2tools-logo-tab"><button class="datasets2tools-logo-button datasets2tools-button"></button><span style="font-size:xx-small">&nbsp</span><div class="datasets2tools-title-label datasets2tools-compact">Datasets2Tools</div></div>',
			toolTabHTML = self.getToolTabHTML(datasetAccessionString, cannedAnalysisData),
			selectedToolTabHTML = '<div class="datasets2tools-selected-tool-tab datasets2tools-expand"></div>',
			searchTabHTML = '<div class="datasets2tools-search-tab datasets2tools-expand"><div class="datasets2tools-tool-info-label"> <i>Tool Information</i> </div> <form class="datasets2tools-search-form"> <div class="datasets2tools-search-label">Search:</div><div class="datasets2tools-search-input"><input class="datasets2tools-search-text-input" type="text" name="datasets2tools-search-query"></div></form></div>',
			browseBarHTML = '<div class="datasets2tools-browse-bar datasets2tools-expand"><div id="' + datasetAccessionString + '" class="datasets2tools-table-wrapper"></div><div class="datasets2tools-tool-info-tab"></div></div>';
		interfaceHTML = toolbarHTML + searchBarHTML + logoTabHTML + toolTabHTML + selectedToolTabHTML + searchTabHTML + '</div>' + browseBarHTML + '</div>';
		return interfaceHTML;
	},

	//////////////////////////////
	///// 3. compact
	//////////////////////////////

	///// Switches the display to compact: hides the browsetable, shows the toolbar, colorizes the icon.

	compact: function($datasets2toolsToolbar) {
		$datasets2toolsToolbar.find('.datasets2tools-compact').show();
		$datasets2toolsToolbar.find('.datasets2tools-expand').hide();
		$datasets2toolsToolbar.find('.datasets2tools-tool-info-label').hide();
		$datasets2toolsToolbar.find('.datasets2tools-search-form').show();
		$datasets2toolsToolbar.find('.datasets2tools-search-bar').css('display', 'inline-block');
		$datasets2toolsToolbar.find('.datasets2tools-logo-button').css({'filter': 'grayscale(0%)', 'opacity': '1'});
	},

	//////////////////////////////
	///// 4. expand
	//////////////////////////////

	///// Switches the display to expand: shows the browsetable, hides the toolbar, turns the icon to grayscale.

	expand: function($datasets2toolsToolbar) {
		$datasets2toolsToolbar.find('.datasets2tools-compact').hide();
		$datasets2toolsToolbar.find('.datasets2tools-expand').show();
		$datasets2toolsToolbar.find('.datasets2tools-search-bar').css('display', 'block');
		$datasets2toolsToolbar.find('.datasets2tools-logo-button').css({'filter': 'grayscale(100%)', 'opacity': '0.5'});
	},

	//////////////////////////////
	///// 5. addSelectedToolTab
	//////////////////////////////

	///// Adds the tab with information about the selected tool.

	addSelectedToolTab: function($datasets2toolsToolbar, toolId, cannedAnalysisData) {
		var $selectedToolTab = $datasets2toolsToolbar.find('.datasets2tools-selected-tool-tab');
		var selectedToolTabHTML = '<img src="' + cannedAnalysisData['tools'][toolId]['tool_icon_url'] + '" class="datasets2tools-selected-tool-img" id="' + toolId + '"><div class="datasets2tools-selected-tool-label">' + cannedAnalysisData['tools'][toolId]['tool_name'] + '</div><button type="button" class="datasets2tools-tool-info-button datasets2tools-button"></button>';
		$selectedToolTab.html(selectedToolTabHTML);
	},

	//////////////////////////////
	///// 7. addToolInfoTab
	//////////////////////////////

	///// Adds the tab with information about the tool, expanded.

	addToolInfoTab: function($datasets2toolsToolbar, toolId, cannedAnalysisData) {
		var toolDescriptionHTML = cannedAnalysisData['tools'][toolId]['tool_description'];
		var toolLinkHTML = '<a href="' + cannedAnalysisData['tools'][toolId]['tool_homepage_url'] + '">Homepage</a>';
		// var publicationLinkHTML = '<a href="' + cannedAnalysisData['tools'][toolId]['publication_url'] + '">Reference</a>';
		// toolInfoHTML = '<b><u>Tool Description</b></u><br>' + toolDescriptionHTML + '<br><br><b><u>Links</b></u><br>' + toolLinkHTML + '&nbsp' + publicationLinkHTML + '<button class="datasets2tools-close-tool-info-button">✖</button>';
		toolInfoHTML = '<b><u>Tool Description</b></u><br>' + toolDescriptionHTML + '<br><br><b><u>Links</b></u><br>' + toolLinkHTML + '<button class="datasets2tools-close-tool-info-button">✖</button>';
		$datasets2toolsToolbar.find('.datasets2tools-tool-info-tab').html(toolInfoHTML);
		$datasets2toolsToolbar.find('.datasets2tools-search-form').hide();
		$datasets2toolsToolbar.find('.datasets2tools-tool-info-label').show();
		$datasets2toolsToolbar.find('.datasets2tools-tool-info-tab').show();
		$datasets2toolsToolbar.find('.datasets2tools-table-wrapper').hide();
	}
};

//////////////////////////////////////////////////
////////// 5. tooltable //////////////////////////
//////////////////////////////////////////////////

///// Functions related to preparing the Datasets2Tools tooltable for dataset landing pages.

var tooltable = {

	//////////////////////////////
	///// 1. getHTML
	//////////////////////////////

	///// Gets the HTML for the tooltable, to display on dataset landing pages.

	getHTML: function(datasetAccessionString, cannedAnalysisData) {
		var toolTableHTML = '<div class="datasets2tools-table-intro">The following table displays a list of computational tools which have been used to generate canned analyses of the dataset.  To explore the analyses, click on the expand button on the right of the desired tool.</div><div id="' + datasetAccessionString + '" class="datasets2tools-table-wrapper"><table class="datasets2tools-tool-table"><tr><th class="datasets2tools-tooltable-tool-header">Tool</th><th class="datasets2tools-tooltable-description-header">Description</th><th class="datasets2tools-tooltable-cannedanalysis-header">Canned Analyses</th></tr>',
			toolIds = Object.keys(cannedAnalysisData['tools']),
			cannedAnalyses = cannedAnalysisData['canned_analyses'][datasetAccessionString],
			toolData = cannedAnalysisData['tools'],
			nrOfCannedAnalyses = {},
			toolId;
		for (i = 0; i < toolIds.length; i++) {
			toolId = toolIds[i];
			nrOfCannedAnalyses[toolId] = Object.keys(cannedAnalyses[toolId]).length;
		}
		toolsSorted = Object.keys(nrOfCannedAnalyses).sort(function(a,b){return nrOfCannedAnalyses[b]-nrOfCannedAnalyses[a]});
		for (i = 0; i < toolsSorted.length; i++) {
			toolId = toolsSorted[i];
			toolTableHTML += '<tr class="datasets2tools-tooltable-row"><td class="datasets2tools-tooltable-tool-col"><a href="' + toolData[toolId]['tool_homepage_url'] + '"><img class="datasets2tools-tooltable-tool-img" src="' + toolData[toolId]['tool_icon_url'] + '" id="' + toolId + '"></a><a class="datasets2tools-tooltable-tool-label" href="' + toolData[toolId]['tool_homepage_url'] + '">' + toolData[toolId]['tool_name'] + '</a></td>';
			toolTableHTML += '<td class="datasets2tools-tooltable-description-col">' + toolData[toolId]['tool_description'] + '</td>';
			toolTableHTML += '<td class="datasets2tools-tooltable-cannedanalysis-col">' + Object.keys(cannedAnalyses[toolId]).length + '<button class="datasets2tools-tooltable-plus-button datasets2tools-button" type="button" id="' + toolId + '"></button></td></tr>';
		}
		toolTableHTML += '</table></div>';
		return toolTableHTML;
	},

	//////////////////////////////
	///// 2. addToolDescription
	//////////////////////////////

	///// Add tool description when clicking on a plus icon, and functions to go back to the table.

	addToolDescription: function($evtTarget, toolId, cannedAnalysisData) {
		var toolDescriptionHTML = '<a class="datasets2tools-back"> <<< Back To Tools </a><br><div class="datasets2tools-tooltable-toolintro"><img class="datasets2tools-selected-tool-img" id="' + toolId + '" style="height:50px;width:50px;" src="' + cannedAnalysisData['tools'][toolId]['tool_icon_url'] + '"></img><div class="datasets2tools-tooltable-toolname">' + cannedAnalysisData['tools'][toolId]['tool_name'] + '</div></div>';
		toolDescriptionHTML += '<div class="datasets2tools-toolintro-subtitle">Tool Description</div>' + cannedAnalysisData['tools'][toolId]['tool_description'] + '.<div class="datasets2tools-toolintro-subtitle">Resources</div><a href="' + cannedAnalysisData['tools'][toolId]['tool_homepage_url'] + '">Homepage</a>&nbsp&nbsp&nbspReference';
		toolDescriptionHTML += '<div class="datasets2tools-toolintro-subtitle">Canned Analyses</div>The table below displays existing canned analyses for the dataset-tool pair.  Users can access canned analysis URLs by clicking on the links, browse and download analysis metadata, search analyses by keywords, and share the analyses with other users.<form class="datasets2tools-search-form"><div class="datasets2tools-search-label">Search:</div><div class="datasets2tools-search-input"><input class="datasets2tools-search-text-input" type="text" name="datasets2tools-search-query"></div></form>';
		$('.datasets2tools-main').find('.datasets2tools-table-intro').html(toolDescriptionHTML);
	},

	//////////////////////////////
	///// 3. add
	//////////////////////////////

	///// Adds the tooltable.

	add: function($parent, elementHTML) {
		var self = this;
		$parent.after('<div class="panel-group" id="accordion-cannedAnalyses" role="tablist" aria-multiselectable="true"><div class="panel panel-info"><div class="panel-heading" role="tab" id="heading-dataset-cannedAnalyses"><h4 class="panel-title"><a role="button" data-toggle="collapse" data-parent="#accordion-cannedAnalyses" data-target="#collapse-dataset-cannedAnalyses" href="#collapse-dataset-cannedAnalyses" aria-expanded="true" aria-controls="collapse-dataset-cannedAnalyses"><i class="fa fa-chevron-up"></i>&nbspCanned Analyses</a></h4></div><div id="collapse-dataset-cannedAnalyses" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading-dataset-cannedAnalyses"><div class="panel-body"><div id="' + Interface.getDatasetAccession($parent) + '" class="datasets2tools-main ' + Page.getLabel() + '">'+elementHTML+'</div></div></div></div></div>');
	}
};

//////////////////////////////////////////////////
////////// 6. browsetable ////////////////////////
//////////////////////////////////////////////////

///// Functions related to the canned analysis browse table.

var browsetable = {

	//////////////////////////////
	///// 1. getLinkHTML
	//////////////////////////////

	///// Prepares the HTML code for the canned analysis link, column 1 of the canned analysis table.

	getLinkHTML: function(cannedAnalysisObj, toolIconUrl) {
		return '<td><a href="' + cannedAnalysisObj['canned_analysis_url'] + '"><img class="datasets2tools-cannedanalysis-link-img" src="' + toolIconUrl + '"></a></td>';
	},

	//////////////////////////////
	///// 2. getDescriptionHTML
	//////////////////////////////

	///// Prepares the HTML code for the canned analysis description, column 2 of the canned analysis table.

	getDescriptionHTML: function(cannedAnalysisObj, maxDescriptionLength) {

		// Get description
		var cannedAnalysisDescription = cannedAnalysisObj['description'];

		// // Prepare Displayed Description
		// if (cannedAnalysisDescription.length > maxDescriptionLength) {

		// 	displayedDescription = cannedAnalysisDescription.substring(0, maxDescriptionLength) + '<span class="datasets2tools-tooltip-hover datasets2tools-description-tooltip-hover">...<div class="datasets2tools-tooltip-text datasets2tools-description-tooltip-text">' + cannedAnalysisDescription + '</div></span>';

		// } else {

		// 	displayedDescription = cannedAnalysisDescription;

		// }

		// // Return
		// return '<td class="datasets2tools-canned-analysis-description">' + displayedDescription + '</td>';

		// Return
		return '<td class="datasets2tools-canned-analysis-description" data-toggle="tooltip" data-container="body" data-placement="bottom" title="' + cannedAnalysisDescription + '">' + cannedAnalysisDescription + '</td>';//'<div class="datasets2tools-tooltip-text datasets2tools-description-tooltip-text">' + cannedAnalysisDescription + '</div></td>';		
	},

	//////////////////////////////
	///// 3. getViewMetadataHTML
	//////////////////////////////

	///// Prepares the HTML code for the metadata view hover, column 3 of the canned analysis table.

	getViewMetadataHTML: function(cannedAnalysisObj) {

		// Define variables
		var metadataKeys = Object.keys(cannedAnalysisObj),
			metadataKeyNumber = metadataKeys.length,
			metadataTooltipString = '', //<b>Metadata</b><br>
			viewMetadataHTML,
			metadataKey;

		// Loop through tags
		if (metadataKeyNumber > 2) {

			for (var j = 0; j < metadataKeyNumber; j++) {

				// Get Metadata Key
				metadataKey = metadataKeys[j];

				// Get Metadata Value
				if (!(['canned_analysis_url', 'description'].indexOf(metadataKey) >= 0)) {
					metadataTooltipString += '<b>' + metadataKey + '</b>: ' + cannedAnalysisObj[metadataKey] + '<br>';
				}
			}

		} else {

			metadataTooltipString += 'No metadata available.';

		}

		// Close DIV
		viewMetadataHTML = '<div class="datasets2tools-tooltip-hover datasets2tools-metadata-tooltip-hover"><img class="datasets2tools-view-metadata-img datasets2tools-metadata-img" src="icons/info.png"><div class="datasets2tools-tooltip-text datasets2tools-metadata-tooltip-text">'+metadataTooltipString+'</div></div>';

		// Return
		return viewMetadataHTML;
	},

	//////////////////////////////
	///// 4. getDownloadMetadataHTML
	//////////////////////////////

	///// Prepares the HTML code for the metadata download dropdown, column 3 of the canned analysis table.

	getDownloadMetadataHTML: function(cannedAnalysisObj) {

		// Define variables
		var downloadMetadataHTML = '<div class="datasets2tools-dropdown-hover datasets2tools-metadata-dropdown-hover">';

		// Add Stuff
		downloadMetadataHTML += '<button class="datasets2tools-button datasets2tools-dropdown-button datasets2tools-download-metadata-button"></button>';
		
		// Add Stuff
		downloadMetadataHTML += '<div class="datasets2tools-dropdown-text datasets2tools-metadata-dropdown-text">';

		// Add functionality
		downloadMetadataHTML += '<b>Download Metadata:</b><br>';

		// Add TXT Button
		downloadMetadataHTML += '<ul style="margin:0;padding-left:20px;"><li><button class="datasets2tools-button datasets2tools-metadata-download-button" id="getTXT">TXT</button></li>';

		// Add JSON Button
		downloadMetadataHTML += '<li><button class="datasets2tools-button datasets2tools-metadata-download-button" id="getJSON">JSON</button></li></ul>';
		
		// Close DIV
		downloadMetadataHTML += '</div></div>';

		// Return
		return downloadMetadataHTML;
	},

	//////////////////////////////
	///// 5. downloadFile
	//////////////////////////////

	///// Downloads metadata file.


	downloadFile: function(text, filename) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	},

	//////////////////////////////
	///// 6. downloadMetadata
	//////////////////////////////

	///// Formats the metadata in the appropriate way (TXT or JSON), preparing it for download.

	downloadMetadata: function(cannedAnalysisObj, fileFormat) {
		var self = this,
			metadataString;
		switch(fileFormat) {
			case 'TXT':
				var metadataString = 'Tag\tValue\n',
					metadataKey,
					metadataKeys = Object.keys(cannedAnalysisObj);
				for (var k = 0; k < metadataKeys.length; k++) {
					metadataKey = metadataKeys[k];
					metadataString += metadataKey + '\t' + cannedAnalysisObj[metadataKey] + '\n';
				}
				self.downloadFile(metadataString, 'metadata.txt');
				break;

			case 'JSON':
				metadataString = JSON.stringify(cannedAnalysisObj, null, 2);
				self.downloadFile(metadataString, 'metadata.json');
				break;
		}
	},

	//////////////////////////////
	///// 7. getShareHTML
	//////////////////////////////

	///// Prepares the HTML code for the share dropdown, column 4 of the canned analysis table.

	getShareHTML: function(cannedAnalysisObj, toolIconUrl) {

		// Define HTML String
		var shareHTML = '<td>';

		// Interactive DIV HTML
		var interactiveDivHTML = '<div class="datasets2tools-dropdown-hover datasets2tools-share-dropdown-hover">';

		// Dropdown DIV HTML
		var dropdownDivHTML = '<div class="datasets2tools-dropdown-text datasets2tools-share-dropdown-text">';

		// Share Image
		var shareImageHTML = '<button class="datasets2tools-button datasets2tools-dropdown-button datasets2tools-share-button"></button>';

		// Link Image
		var linkImageHTML = '<img class="datasets2tools-dropdown-icons-img" src="icons/link.png"><b>Canned Analysis URL:</b>';

		// Embed Image
		var embedImageHTML = '<img class="datasets2tools-dropdown-icons-img" src="icons/embed.png"><b>Embed Icon:</b>';

		// Get Copy Button HTML
		var buttonHTML = '<button class="datasets2tools-button datasets2tools-copy-button"><img class="datasets2tools-dropdown-icons-img" src="icons/copy.png">Copy</button>';

		// Text Area HTML
		var textAreaHTML = function(content, nRows) {return '<textarea class="datasets2tools-textarea" rows="' + nRows + '">'+content+'</textarea>'};

		// Canned Analysis URL
		var cannedAnalysisUrl = cannedAnalysisObj['canned_analysis_url'];

		// Embed Code
		var embedCode = '<a href="' + cannedAnalysisUrl + '"><img src="' + toolIconUrl + '" style="height:50px;width:50px"></a>'

		shareHTML += interactiveDivHTML + shareImageHTML + dropdownDivHTML + linkImageHTML + textAreaHTML(cannedAnalysisUrl, 2) + buttonHTML + '<br><br>' + embedImageHTML + textAreaHTML(embedCode, 3) + buttonHTML + '</div></div></td>';

		return shareHTML;
	},

	//////////////////////////////
	///// 8. getArrowTabHTML
	//////////////////////////////

	///// Prepares the HTML code for the arrow tab, which allows users to browse the canned analysis table.

	getArrowTabHTML: function(pageNr, pageSize, pairCannedAnalyses) {

		// Define variables
		var numberOfCannedAnalyses = Object.keys(pairCannedAnalyses).length,
			self = this,
			arrowTabHTML = '',
			leftArrowClass,
			rightArrowClass;

		// Add description
		arrowTabHTML += '<div class="datasets2tools-browse-table-arrow-tab"> Showing results ' + Math.min(((pageNr-1)*pageSize+1), numberOfCannedAnalyses) + '-' + Math.min((pageNr*(pageSize)), numberOfCannedAnalyses) + ' of ' + numberOfCannedAnalyses + '.&nbsp&nbsp&nbsp'
		
		// Get left arrow class (condition: if true, if false)
		leftArrowClass = (pageNr > 1 ? '" id="' + (pageNr-1) + '"' : ' datasets2tools-disabled-arrow')

		// Add left arrow
		arrowTabHTML += '<button class="datasets2tools-button datasets2tools-browse-arrow datasets2tools-browse-arrow-left' + leftArrowClass + '"></button>';

		// Get right arrow class (condition: if true, if false)
		rightArrowClass = (numberOfCannedAnalyses > pageNr*(pageSize) ? '" id="' + (parseInt(pageNr) + 1) + '"' : ' datasets2tools-disabled-arrow')

		// Add right arrow
		arrowTabHTML += '<button class="datasets2tools-button datasets2tools-browse-arrow datasets2tools-browse-arrow-right' + rightArrowClass + '"></button></div>';

		// Return HTML string
		return arrowTabHTML;
	},

	//////////////////////////////
	///// 9. completeTableHTML
	//////////////////////////////

	///// Completes the canned analysis table HTML, adding specifed canned analyses on rows, and browsing functions.

	completeTableHTML: function(pairCannedAnalysesSubset, toolIconUrl, maxDescriptionLength=1000) {

		// Get canned analysis IDs
		var cannedAnalysisIds = Object.keys(pairCannedAnalysesSubset),
			self = this,
			browseTableHTMLEnd = '';

		// Loop Through Canned Analyses
		for (var i = 0; i < cannedAnalysisIds.length; i++) {

			// Get Canned Analysis Id
			cannedAnalysisId = cannedAnalysisIds[i];

			// Get Canned Analysis Object
			cannedAnalysisObj = pairCannedAnalysesSubset[cannedAnalysisId];

			// Add Row HTML
			browseTableHTMLEnd += '<tr class="datasets2tools-canned-analysis-row" id="' + cannedAnalysisId + '">' +
								  self.getLinkHTML(cannedAnalysisObj, toolIconUrl) + 
								  self.getDescriptionHTML(cannedAnalysisObj, maxDescriptionLength) +
								  '<td class="datasets2tools-metadata-col">' + self.getViewMetadataHTML(cannedAnalysisObj) + self.getDownloadMetadataHTML(cannedAnalysisObj) + '</td>' +
								  self.getShareHTML(cannedAnalysisObj, toolIconUrl) +
								  '</tr>';
		}

		// Close table
		browseTableHTMLEnd += '</table>';

		// Return HTML string
		return browseTableHTMLEnd;
	},

	//////////////////////////////
	///// 10. getHTML
	//////////////////////////////

	///// Generate the canned analysis table HTML, given the canned analysis subset, by applying search filters and fixing number of rows.

	getHTML: function(pairCannedAnalyses, toolIconUrl, searchFilter='', pageNr=1, pageSize=5) {

		// Define variables
		var self = this,
			pairCannedAnalysesCopy = jQuery.extend({}, pairCannedAnalyses),
			browseTableHTML = '<table class="datasets2tools-browse-table"><tr><th class="datasets2tools-link-col">Link</th><th class="datasets2tools-description-col">Description</th><th class="datasets2tools-metadata-col">Metadata</th><th class="datasets2tools-share-col">Share</th></tr>',
			cannedAnalysisIds = Object.keys(pairCannedAnalysesCopy), cannedAnalysisId, pairCannedAnalysesSubset, browseTableHTML, maxDescriptionLength;

		// Filter search
		if (searchFilter.length > 0) {
			for (var i = 0; i < cannedAnalysisIds.length; i++) {
				cannedAnalysisId = cannedAnalysisIds[i];
				cannedAnalysisDescription = pairCannedAnalysesCopy[cannedAnalysisId]['description'];
				if (!(cannedAnalysisDescription.toLowerCase().includes(searchFilter.toLowerCase()))) {
					delete pairCannedAnalysesCopy[cannedAnalysisId];
				};
			};
		};

		// Get subset
		pairCannedAnalysesSubset = (Object.keys(pairCannedAnalysesCopy).length > pageSize ? Object.keys(pairCannedAnalysesCopy).sort().slice((pageNr-1)*pageSize, pageNr*pageSize).reduce(function(memo, current) { memo[current] = pairCannedAnalysesCopy[current]; return memo;}, {}) : pairCannedAnalysesCopy);

		// Set max description length
		// if (Page.isDataMedSearchResults()) {
		// 	maxDescriptionLength = 1000
		// } else if (Page.isDataMedLanding()) {
		// 	maxDescriptionLength = 1000
		// }

		// Check if there are any canned analyses
		if (Object.keys(pairCannedAnalysesSubset).length === 0) {

			// Add no results
			browseTableHTML += '<tr><td class="datasets2tools-no-results-tab" colspan="4">No Results Found.</td></tr>';

		} else {

			// Get HTML
			browseTableHTML += self.completeTableHTML(pairCannedAnalysesSubset, toolIconUrl);

			// Add browse functions
			browseTableHTML +=  self.getArrowTabHTML(pageNr, pageSize, pairCannedAnalysesCopy);
		};

		// Return
		return browseTableHTML;
	},

	//////////////////////////////
	///// 11. add
	//////////////////////////////

	///// Adds the canned analysis table to the appropriate elements in DataMed dataset search results pages or dataset landing pages.

	add: function($evtTarget, browseTableHTML) {
		$($evtTarget).parents('.datasets2tools-main').find('.datasets2tools-table-wrapper').html(browseTableHTML);
	}
};

//////////////////////////////////////////////////
////////// 7. eventListener //////////////////////
//////////////////////////////////////////////////

///// Functions related to interactivity with the interface.

var eventListener = {

	//////////////////////////////
	///// 1. clickPlusButton
	//////////////////////////////

	///// Active when selecting a tool's + button on dataset landing pages.  Creates browse table and adds tool description.

	clickPlusButton: function(cannedAnalysisData) {
		$('.datasets2tools-main').on('click', '.datasets2tools-tooltable-plus-button', function(evt) {
			var $evtTarget = $(evt.target),
				datasetAccession = $evtTarget.parents('.datasets2tools-table-wrapper').attr('id'),
				toolId = $evtTarget.parent().parent().find('.datasets2tools-tooltable-tool-img').attr('id'),
				pairCannedAnalyses = cannedAnalysisData['canned_analyses'][datasetAccession][toolId],
				toolIconUrl = cannedAnalysisData['tools'][toolId]['tool_icon_url'],
				browseTableHTML = browsetable.getHTML(pairCannedAnalyses, toolIconUrl);
			$evtTarget.parents('.datasets2tools-table-wrapper').html(browseTableHTML);
			tooltable.addToolDescription($evtTarget, toolId, cannedAnalysisData);
		})
	},

	//////////////////////////////
	///// 2. clickLogoButton
	//////////////////////////////

	///// Active when clicking the logo button on the toolbar in dataset search results pages. Returns toolbar to compact mode.

	clickLogoButton: function() {
		$('.datasets2tools-logo-button').click(function(evt) {
			evt.preventDefault();
			toolbar.compact($(evt.target).parents('.datasets2tools-toolbar'));
		})
	},

	//////////////////////////////
	///// 3. clickToolIcon
	//////////////////////////////

	///// Active when clicking a tool icon on the toolbar in dataset search results pages.  Creates browse table and adds selected tool and search tabs.

	clickToolIcon: function(cannedAnalysisData) {
		$('.datasets2tools-tool-icon-button').click(function(evt) {
			evt.preventDefault();
			var $evtTarget = $(evt.target),
				$datasets2toolsToolbar = $evtTarget.parents('.datasets2tools-toolbar'),
				datasetAccession = $datasets2toolsToolbar.attr('id'),
				toolId = $evtTarget.attr('id'),
				pairCannedAnalyses = cannedAnalysisData['canned_analyses'][datasetAccession][toolId],
				toolIconUrl = cannedAnalysisData['tools'][toolId]['tool_icon_url'],
				searchFilter = $datasets2toolsToolbar.find('.datasets2tools-search-text-input').val(),
				browseTableHTML = browsetable.getHTML(pairCannedAnalyses, toolIconUrl, searchFilter);

			browsetable.add($evtTarget, browseTableHTML);
			toolbar.addSelectedToolTab($datasets2toolsToolbar, toolId, cannedAnalysisData);
			toolbar.expand($(evt.target).parents('.datasets2tools-toolbar'));
			$datasets2toolsToolbar.find('.datasets2tools-table-wrapper').show();
			$datasets2toolsToolbar.find('.datasets2tools-tool-info-tab').hide();
		})
	},
	
	//////////////////////////////
	///// 4. clickToolInfoIcon
	//////////////////////////////

	///// Active when clicking on the information icon in the selected tool tab in dataset search results pages.  Replaces the browse table the tool info tab.

	clickToolInfoIcon: function(cannedAnalysisData) {
		$('.datasets2tools-toolbar').on('click', '.datasets2tools-tool-info-button', function(evt) {
			evt.preventDefault();
			var $evtTarget =  $(evt.target),
				$datasets2toolsToolbar = $evtTarget.parents('.datasets2tools-toolbar'),
				toolId = $datasets2toolsToolbar.find('.datasets2tools-selected-tool-img').attr('id');
			toolbar.addToolInfoTab($datasets2toolsToolbar, toolId, cannedAnalysisData);
		})
	},

	//////////////////////////////
	///// 5. clockToolInfoX
	//////////////////////////////

	///// Active when clicking on the X at the top right of the tool info tab.  Closes it and returns to the browse table.

	clockToolInfoX: function() {
		$('.datasets2tools-toolbar').on('click', '.datasets2tools-close-tool-info-button', function(evt) {
			evt.preventDefault();
			var $evtTarget = $(evt.target),
				$datasets2toolsToolbar = $(evt.target).parents('.datasets2tools-toolbar'),
				datasetAccession = $datasets2toolsToolbar.attr('id'),
				toolId = $datasets2toolsToolbar.find('.datasets2tools-selected-tool-img').attr('id'),
				pairCannedAnalyses = cannedAnalysisData['canned_analyses'][datasetAccession][toolId],
				toolIconUrl = cannedAnalysisData['tools'][toolId]['tool_icon_url'],
				searchFilter = $datasets2toolsToolbar.find('.datasets2tools-search-text-input').val(),
				browseTableHTML = browsetable.getHTML(pairCannedAnalyses, toolIconUrl, searchFilter);
			browsetable.add($evtTarget, browseTableHTML);
			$datasets2toolsToolbar.find('.datasets2tools-search-form').show();
			$datasets2toolsToolbar.find('.datasets2tools-tool-info-label').hide();
			$datasets2toolsToolbar.find('.datasets2tools-table-wrapper').show();
			$datasets2toolsToolbar.find('.datasets2tools-tool-info-tab').hide();
		})
	},
	
	//////////////////////////////
	///// 6. clickArrow
	//////////////////////////////

	///// Active when clicking on an arrow at the bottom of the browse table.  Switches to the previous or next page.

	clickArrow: function(cannedAnalysisData) {
		$('.datasets2tools-main').on('click', '.datasets2tools-browse-arrow', function(evt) {
			evt.preventDefault();
			var $evtTarget = $(evt.target),
				$datasets2toolsMain = $evtTarget.parents('.datasets2tools-main'),
				datasetAccession = $datasets2toolsMain.attr('id'),
				toolId = $datasets2toolsMain.find('.datasets2tools-selected-tool-img').attr('id'),
				toolIconUrl = cannedAnalysisData['tools'][toolId]['tool_icon_url'],
				pairCannedAnalyses = cannedAnalysisData['canned_analyses'][datasetAccession][toolId],
				pageNr = $evtTarget.attr('id'),
				searchFilter = $datasets2toolsMain.find('.datasets2tools-search-text-input').val(),
				browseTableHTML = browsetable.getHTML(pairCannedAnalyses, toolIconUrl, searchFilter, pageNr=pageNr);
			browsetable.add($evtTarget, browseTableHTML);
		})
	},

	//////////////////////////////
	///// 7. searchCannedAnalyses
	//////////////////////////////

	///// Active when performing a search for canned analyses.  Updates the browse table.

	searchCannedAnalyses: function(cannedAnalysisData) {
		$('.datasets2tools-main').on('keyup', '.datasets2tools-search-form', function(evt) {
			var $evtTarget = $(evt.target),
				$datasets2toolsMain = $evtTarget.parents('.datasets2tools-main'),
				datasetAccession = $datasets2toolsMain.attr('id'),
				toolId = $datasets2toolsMain.find('.datasets2tools-selected-tool-img').attr('id'),
				toolIconUrl = cannedAnalysisData['tools'][toolId]['tool_icon_url'],
				searchFilter = $datasets2toolsMain.find('.datasets2tools-search-text-input').val(),
				pairCannedAnalyses = cannedAnalysisData['canned_analyses'][datasetAccession][toolId],
				browseTableHTML = browsetable.getHTML(pairCannedAnalyses, toolIconUrl, searchFilter);
			browsetable.add($evtTarget, browseTableHTML);
		})
	},

	//////////////////////////////
	///// 8. clickDropdownButton
	//////////////////////////////

	///// Active when clicking upon a dropdown button.  Toggles the dropdown menu.

	clickDropdownButton: function() {
		$('.datasets2tools-main').on('click', '.datasets2tools-dropdown-button', function(evt) {
			evt.preventDefault();
			$(evt.target).next().toggle();			
		})
	},

	//////////////////////////////
	///// 9. clickCopyButton
	//////////////////////////////

	///// Active when clicking on a copy button in the share dropdown.  Copies the text in the textarea above.

	clickCopyButton: function() {
		$('.datasets2tools-main').on('click', '.datasets2tools-copy-button', function(evt) {
			evt.preventDefault();
			var $evtTarget = $(evt.target);
			var copyTextArea = $evtTarget.prev()[0];
			copyTextArea.select();
			try {
				var successful = document.execCommand('copy');
			} catch (err) {
				console.log('Oops, unable to copy');
			}
		});
	},

	//////////////////////////////
	///// 10. clickDownloadButton
	//////////////////////////////

	///// Active when clicking on a download button in the download dropdown.  Converts the metadata to an appropriate format and downloads the file.

	clickDownloadButton: function(cannedAnalysisData) {
		$('.datasets2tools-main').on('click', '.datasets2tools-metadata-download-button', function(evt) {
			evt.preventDefault();
			var $evtTarget = $(evt.target),
				fileFormat = $evtTarget.text(),
				datasetAccession = $evtTarget.parents('.datasets2tools-table-wrapper').attr('id'),
				toolId = $('.datasets2tools-main').find('.datasets2tools-selected-tool-img').attr('id'),
				cannedAnalysisId = $evtTarget.parents('tr').attr('id');
			var cannedAnalysisObj = jQuery.extend({}, cannedAnalysisData['canned_analyses'][datasetAccession][toolId][cannedAnalysisId]);
			cannedAnalysisObj['dataset_accession'] = datasetAccession;
			cannedAnalysisObj['tool_name'] = cannedAnalysisData['tools'][toolId]['tool_name'];
			cannedAnalysisObj['tool_url'] = cannedAnalysisData['tools'][toolId]['tool_homepage_url'];
			browsetable.downloadMetadata(cannedAnalysisObj, fileFormat);
		});
	},

	//////////////////////////////
	///// 11. clickGoBack
	//////////////////////////////

	///// Active when clicking on the 'go back' div in the dataset landing pages, when a tool has been selected.  Removes the browse table and regenerates the tool table.

	clickGoBack: function(cannedAnalysisData) {
		$('.datasets2tools-main').on('click', '.datasets2tools-back', function(evt) {
			evt.preventDefault();
			var datasetAccession=$('.datasets2tools-table-wrapper').attr('id'),
				tooltableHTML =  tooltable.getHTML(datasetAccession, cannedAnalysisData);
			$('.datasets2tools-main').html(tooltableHTML);
		})
	},

	//////////////////////////////
	///// 12. main
	//////////////////////////////

	///// Groups the event listeners.

	main: function(cannedAnalysisData) {
		var self = this;
		self.clickPlusButton(cannedAnalysisData);
		self.clickLogoButton();
		self.clickToolIcon(cannedAnalysisData);
		self.clickToolInfoIcon(cannedAnalysisData);
		self.clockToolInfoX(cannedAnalysisData);
		self.clickArrow(cannedAnalysisData);
		self.searchCannedAnalyses(cannedAnalysisData);
		self.clickDropdownButton();
		self.clickCopyButton();
		self.clickDownloadButton(cannedAnalysisData);
		self.clickGoBack(cannedAnalysisData);

		// $('.datasets2tools-main').on('mouseenter', '.datasets2tools-canned-analysis-description', function(evt) {
		// 	$(evt.target).tooltip().mouseover();
		// })
		
	}
};

//////////////////////////////////////////////////////////////////////
///////// 3. Run Main Function ///////////////////////////////////////
//////////////////////////////////////////////////////////////////////
main();
