<?php
class Functions{

	public function processVisitor($content){
		
		$count = 0;
		$visitorObj = new \stdClass;
		$obj = new \stdClass;
		$visitorArr = array();
		$isNameFound = false;
		$license = "DEPARTMENT OF TRANSPORTATION AND COMMUNICATIONS";
		$tempName = "";
		for ($a = 0; $a < count($content); $a++){
			//logic for company name
			if(is_array($content[0])){
				$arr1 = array_map('strtolower', $content[0]);
				if(in_array("republic", $arr1) && is_array($content[1])){
					$visitorArr["company"] = implode(" ", $content[1]);
				} else {
					$visitorArr["company"] = $content[1];
				}
			} else {
				$visitorArr["company"] = $content[0];
			}

			if(is_array($content[$a])){
				$arr2 = array_map('strtolower', $content[$a]);
				// logic for name
				if((in_array("last", $arr2) && in_array("first", $arr2) && in_array("middle", $arr2)) ||
					(in_array("surname", $arr2) && in_array("given", $arr2) && in_array("middle", $arr2))){
						$visitorArr["name"] = implode(" ", $content[$a + 1]);
				} else if((in_array("last", $arr2) && !in_array("first", $arr2) && !in_array("middle", $arr2)) ||
					((in_array("surname:", $arr2) || in_array("surname", $arr2)) && !in_array("given", $arr2) && !in_array("middle", $arr2)) ||
					(in_array("apelyido/surname:", $arr2))){
						if($content[$a][1] == "Name:" || $content[$a][1] == "Name" || 
						$content[$a][1] == "name:" || $content[$a][1] == "name"){
							$last = $content[$a][2];
						} else $last = $content[$a][1];
						
						if ($content[$a + 1][1] == "Name:" || $content[$a + 1][1] == "Name" || 
						$content[$a][1] == "name:" || $content[$a][1] == "name"){
							$first = $content[$a + 1][2];
						} else $first = $content[$a + 1][1];
						
						if ($content[$a + 2][1] == "Name:" || $content[$a + 2][1] == "Name" || 
						$content[$a][1] == "name:" || $content[$a][1] == "name"){
							$middle = $content[$a + 2][2];
						} else $middle = $content[$a + 2][1];
						$visitorArr["name"] = $last." ".$first." ".$middle;
				} else { //Other ID
					for ($b = 0; $b < count($content[$a]); $b++){
						if((stripos($content[$a][$b], ".") > - 1 || stripos($content[$a][$b], ",") > - 1) && ($content[$a][$b] != "no." || 
						$content[$a][$b] != "NO." || $content[$a][$b] != "No.")){
							if($tempName == null) $tempName = implode(" ", $content[$a]);
							$visitorArr["name"] = $tempName;
						}
					}
				}
				
				//logic for id number
				//CRN and VIN
				if(in_array("crn", $arr2) || in_array("vin", $arr2) || in_array("crn:", $arr2) || in_array("vin:", $arr2)){
					$visitorArr["id"] = $content[$a][1];
				} 
				//License Number/PAGIBIG Membership
				if((in_array("license", $arr2) && $visitorObj["company"] == $license) || in_array("md", $arr2)){
					$visitorArr["id"] = $content[$a + 1];
				}
				//Passport Number
				if(in_array("passport", $arr2)){
					$visitorArr["id"] = substr($content[(count($content)) - 1], 0, 9);
				}
			} else {
				//Passport Number
				$str = strtolower($content[$a]);
				if($str == "passport" || $str == "passport/pasaporte"){
					$visitorArr["id"] = substr($content[(count($content)) - 1], 0, 9);
				}
			}
		}
		$dataArr = json_encode($visitorArr);
		$obj->data = $dataArr;
		return $obj;
	}
}
?>