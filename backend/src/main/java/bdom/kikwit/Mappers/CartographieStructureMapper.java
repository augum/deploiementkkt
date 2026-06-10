package bdom.kikwit.Mappers;

import bdom.kikwit.Dto.CartographieStructureRequestDto;
import bdom.kikwit.Dto.CartographieStructureResponseDto;
import bdom.kikwit.Entities.CartographieStructure;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CartographieStructureMapper {

    CartographieStructureResponseDto ToCartographieStructureResponseDto(CartographieStructure structure);
    CartographieStructure fromCartographieStructureRequestDto(CartographieStructureRequestDto requestDto);
}
