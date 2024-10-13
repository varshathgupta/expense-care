import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { MoreVertical } from "lucide-react";


function DropDownExpenseTable() {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<MoreVertical />}
        bgColor={"inherit"}
        _hover={{ bgColor: "primary" }}
      />
      <MenuList bgColor={"lightgray"}>
        <MenuItem bgColor={"lightgray"} icon={<EditIcon />} command="⌘O">
          Edit name
        </MenuItem>
        <MenuItem bgColor={"lightgray"} icon={<AddIcon />} command="⌘T">
          Move expense
        </MenuItem>
        <MenuItem bgColor={"lightgray"} icon={<DeleteIcon />} command="⌘N">
          Delete expense
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default DropDownExpenseTable;
