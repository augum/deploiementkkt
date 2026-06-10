package bdom.kikwit.Services;

import bdom.kikwit.Dto.RoleRequestDto;
import bdom.kikwit.Dto.RoleResponseDto;

import java.util.List;

public interface RoleService {

    RoleResponseDto save(RoleRequestDto requestDto);
    RoleResponseDto update(Long id, RoleRequestDto requestDto);
    String delete(Long id);
    List<RoleResponseDto> list();
    RoleResponseDto getOne(Long id);
}
