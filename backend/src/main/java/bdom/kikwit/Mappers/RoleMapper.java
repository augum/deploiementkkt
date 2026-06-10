package bdom.kikwit.Mappers;

import bdom.kikwit.Dto.RoleRequestDto;
import bdom.kikwit.Dto.RoleResponseDto;
import bdom.kikwit.Entities.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    RoleResponseDto toRoleResponseDto(Role role);
    Role fromRoleRequestDto(RoleRequestDto requestDto);
}
